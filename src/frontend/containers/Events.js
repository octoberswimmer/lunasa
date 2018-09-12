/*
 * A container is a class that holds client-side state, and exposes methods to
 * trigger state transitions. Multiple React components may subscribe to
 * the same container, ensuring that state is synchronized between components.
 *
 * See:
 * https://github.com/jamiebuilds/unstated/blob/master/README.md
 *
 * @flow strict
 */

import { type EventObjectInput } from "fullcalendar"
import { Container } from "unstated"
import Events, { type Event } from "../api/Events"
import type RemoteObject from "../api/RemoteObject"
import { type RestApi } from "../api/RestApi"
import { type Criteria } from "../api/SObject"
import { type Account } from "../models/Account"
import {
	forFullcalendar,
	newEvent,
	updateStartEnd,
	updateEnd
} from "../models/Event"
import { type FieldSet } from "../models/FieldSet"
import { type Layout } from "../models/Layout"
import { visualforceDatetime } from "../models/serialization"
import {
	type SObjectDescription,
	getRelationshipName
} from "../models/SObjectDescription"
import { type Record, getId, getType } from "../models/QueryResult"
import { type RecordTypeInfo } from "../models/RecordType"
import { stringifyCondition } from "../models/WhereCondition"
import { setTimezone } from "../util/moment"
import {
	type AsyncActionState,
	asyncAction,
	asyncActionInitState,
	isLoading
} from "./asyncAction"
import { memoize, preserveRequestOrder, skipDuplicateInputs } from "./memoize"

type Id = string

export type State = AsyncActionState & {
	events: Event[],
	eventCreateFieldSet: FieldSet,
	eventDescription: ?SObjectDescription,
	eventDraft: ?$Shape<Event>,
	eventLayout: ?Layout,
	eventRecordTypeInfos: RecordTypeInfo[],
	referenceData: { [key: Id]: Record }, // map from Event IDs to What and Who properties
	timezone: string,
	userId: Id
}

export default class EventContainer extends Container<State> {
	_remoteObject: RemoteObject<Event>
	_restClient: Promise<RestApi>

	// Memoized API interfaces
	_fetchEvents: (query: Criteria<Event>) => Promise<void>
	_fetchEventDescription: () => Promise<void>
	_fetchEventLayout: () => Promise<void>
	_fetchReferenceData: (eventId: Id) => Promise<void>
	_requestEvents: (query: Criteria<Event>) => Promise<Event[]>

	constructor(opts: {|
		eventCreateFieldSet: FieldSet,
		eventRecordTypeInfos: RecordTypeInfo[],
		remoteObject?: RemoteObject<Event>,
		restClient: Promise<RestApi>,
		timezone: string,
		userId: Id
	|}) {
		super()
		this._remoteObject = opts.remoteObject || Events
		this._restClient = opts.restClient
		this.state = {
			...asyncActionInitState,
			events: [],
			eventCreateFieldSet: opts.eventCreateFieldSet,
			eventDescription: null,
			eventDraft: null,
			eventLayout: null,
			eventRecordTypeInfos: opts.eventRecordTypeInfos,
			referenceData: {},
			timezone: opts.timezone,
			userId: opts.userId
		}

		// Memoizing methods that fetch data from APIs avoids loops where
		// a compnent triggers a fetch, the fetch process triggers a state
		// change which rerenders the component, which triggers a fetch, and so
		// on. Use `skipDuplicateEvents` for methods that should be callable
		// multiple times with the same inputs - e.g. when navigating forward
		// a page of results and navigating back.
		this._fetchEvents = skipDuplicateInputs(this._fetchEvents.bind(this))
		this._fetchEventDescription = memoize(
			this._fetchEventDescription.bind(this)
		)
		this._fetchEventLayout = memoize(this._fetchEventLayout.bind(this))
		this._fetchReferenceData = memoize(this._fetchReferenceData.bind(this))

		// Skip making the request on consecutive calls with the same query to
		// avoid getting stuck in a loop. Preserve order so that results from
		// slow-running requests do not overwrite results from faster,
		// more-recently-dispatched requests.
		this._requestEvents = preserveRequestOrder(query =>
			this._remoteObject.retrieve(query)
		)
	}

	isCreatingEvent(): boolean {
		const draft = this.state.eventDraft
		return !!draft && !draft.Id
	}

	isEditingEvent(): boolean {
		const draft = this.state.eventDraft
		return !!draft && !!draft.Id
	}

	isLoading(): boolean {
		return isLoading(this)
	}

	getErrors(): Error[] {
		return this.state.errors
	}

	/*
	 * The type union here includes `number` because the FullCalendar type for
	 * an event ID is a union of `string` and `number`.
	 */
	getEvent(id: Id | number | void): ?Event {
		if (id) {
			return this.state.events.find(e => e.Id === id)
		}
	}

	/*
	 * `getEventDescription` returns a cached `SObjectDescription`, or triggers
	 * a fetch. This function must be synchronous because it is called from
	 * React components. When the fetch completes the state in this class will
	 * update, the component will rerender, and it will call this method again.
	 */
	getEventDescription(): ?SObjectDescription {
		const description = this.state.eventDescription
		if (description) {
			return description
		} else {
			this._fetchEventDescription()
		}
	}

	/*
	 * `getEventLayout` returns the layout for associated with the user's
	 * default event record type, or triggers a fetch for the layout if it has
	 * not been loaded yet.
	 */
	getEventLayout(): ?Layout {
		const layout = this.state.eventLayout
		if (layout) {
			return layout
		} else {
			this._fetchEventLayout()
		}
	}

	getEventsForFullcalendar(): EventObjectInput[] {
		return this.state.events.map(e => forFullcalendar(this.state.timezone, e))
	}

	/*
	 * `getReference` provides a record from a polymorphic reference. For
	 * example:
	 *
	 *     const what = getReference("WhatId", eventId)
	 *     what.Name // string
	 *     what.attributes.type // e.g., "Account"
	 *     what.attributes.url // URL
	 *
	 * Triggers a fetch for reference data if it has not been downloaded. This
	 * function must be synchronous because it is called from React components.
	 * When the fetch completes the state in this class will update, the
	 * component will rerender, and it will call this method again.
	 */
	getReference(referenceField: string, eventId: ?Id): ?Record {
		const data = this.state.referenceData[eventId || "draft"]
		const description = this.getEventDescription()
		if (!data && eventId) {
			this._fetchReferenceData(eventId)
		}
		if (data && description) {
			const key = getRelationshipName(description, referenceField)
			if (key) {
				return data[key]
			}
		}
	}

	async dismissError(error: Error): Promise<void> {
		await this.setState(state => ({
			errors: state.errors.filter(e => e.message !== error.message)
		}))
	}

	/*
	 * Fetches events from the given date range
	 */
	async getEventsByDateRange(
		rangeStart: moment$Moment,
		rangeEnd: moment$Moment
	): Promise<void> {
		const { timezone } = this.state
		const start = setTimezone(timezone, rangeStart).startOf("day")
		const end = setTimezone(timezone, rangeEnd).endOf("day")
		return this._fetchEvents({
			limit: 100,
			where: {
				StartDateTime: { lt: visualforceDatetime(end) },
				EndDateTime: { gt: visualforceDatetime(start) },
				OwnerId: { eq: this.state.userId }
			}
		})
	}

	async _fetchEvents(query: Criteria<Event>): Promise<void> {
		return asyncAction(this, async () => {
			const events = await this._requestEvents(query)
			await this.setState({ events })
		})
	}

	async _fetchEventDescription(): Promise<void> {
		await asyncAction(this, async () => {
			const eventDescription = await this._remoteObject.describe()
			await this.setState({ eventDescription })
		})
	}

	async _fetchEventLayout(): Promise<void> {
		await asyncAction(this, async () => {
			const client = await this._restClient
			const recordType = this.state.eventRecordTypeInfos.find(
				rt => rt.defaultRecordTypeMapping
			)
			if (!recordType) {
				throw new Error("Could not determine your event record type.")
			}
			const eventLayout = await client.fetchLayout(recordType)
			await this.setState({ eventLayout })
		})
	}

	async _fetchReferenceData(eventId: Id): Promise<void> {
		await asyncAction(this, async () => {
			const where = stringifyCondition({
				field: "Id",
				operator: "equals",
				values: [`'${eventId}'`]
			})
			// Limit fetched relationship data to `Name` and `BillingAddress`
			// fields from `What` and `Who` for now.
			const query = `SELECT What.Name, Who.Name FROM Event WHERE ${where}`
			const client = await this._restClient
			const result = await client.query(query)
			const matchingRecord = result.records[0]
			if (matchingRecord) {
				const [WhatAddress, WhoAddress] = await Promise.all([
					this._fetchBillingAddress(matchingRecord.What),
					this._fetchBillingAddress(matchingRecord.Who)
				])
				matchingRecord.What = WhatAddress
				matchingRecord.Who = WhoAddress
				await this.setState(state => ({
					referenceData: { ...state.referenceData, [eventId]: matchingRecord }
				}))
			}
		})
	}

	async _fetchBillingAddress<T: ?Record>(record: T): Promise<T> {
		if (!record || getType(record) !== "Account") {
			return record
		}
		const where = stringifyCondition({
			field: "Id",
			operator: "equals",
			values: [`'${getId(record)}'`]
		})
		const client = await this._restClient
		const result = await client.query(
			`SELECT BillingAddress FROM Account WHERE ${where}`
		)
		const resultRecord = result.records[0]
		return { ...resultRecord, ...record }
	}

	newEvent(args: {
		account: Account,
		allDay?: boolean,
		date: moment$Moment
	}): $Shape<Event> {
		return newEvent({ ...args, timezone: this.state.timezone })
	}

	/*
	 * Create or update a draft event
	 */
	async setEventDraft(details: $Shape<Event>, account?: Record): Promise<void> {
		const accountWithAddress =
			account && (await this._fetchBillingAddress(account))
		await this.setState(state => {
			const referenceData = accountWithAddress
				? { ...state.referenceData, draft: { What: accountWithAddress } }
				: state.referenceData
			return {
				eventDraft: details,
				referenceData
			}
		})
	}

	async discardEventDraft(): Promise<void> {
		await this.setState(state => {
			const referenceData = { ...state.referenceData }
			delete referenceData.draft
			return {
				eventDraft: null,
				referenceData
			}
		})
	}

	/*
	 * Create a new event, or update an existing event
	 */
	async saveDraft(): Promise<void> {
		await asyncAction(this, async () => {
			const draft = this.state.eventDraft
			if (!draft) {
				throw new Error("There is no event draft to save.")
			}
			const event = draft.Id
				? await this._update(draft)
				: await this._create(draft)
			await this._mergeChangedEvent(event)
		})
	}

	async _create(draft: $Shape<Event>): Promise<Event> {
		const Id = await this._remoteObject.create(draft)
		return { ...draft, Id }
	}

	async _update(draft: $Shape<Event>): Promise<Event> {
		const updatedIds = await this._remoteObject.update([draft.Id], draft)
		if (updatedIds[0] !== draft.Id) {
			throw new Error("An error occurred saving changes to the event")
		}
		return draft
	}

	async _mergeChangedEvent(event: Event): Promise<void> {
		await this.setState(state => {
			const events = state.events.filter(e => e.Id !== event.Id)
			const referenceData = { ...state.referenceData }
			delete referenceData.draft
			return {
				events: events.concat([event]),
				eventDraft: null,
				referenceData
			}
		})
	}

	async updateStartEnd({
		calEvent,
		delta
	}: {
		calEvent: EventObjectInput, // data from Fullcalendar `eventDrop` callback
		delta: moment$MomentDuration
	}): Promise<void> {
		return this._updateEvent(calEvent.id, event =>
			updateStartEnd({ event, calEvent, delta, timezone: this.state.timezone })
		)
	}

	async updateEnd({
		calEvent,
		delta
	}: {
		calEvent: EventObjectInput,
		delta: moment$MomentDuration
	}): Promise<void> {
		return this._updateEvent(calEvent.id, event => updateEnd({ event, delta }))
	}

	async _updateEvent(
		eventId: Id | number | void,
		fn: (event: Event) => Event
	): Promise<void> {
		await asyncAction(this, async () => {
			const event = this.getEvent(eventId)
			if (!event) {
				throw new Error("Could not locate event record.")
			}
			const draft = fn(event)
			try {
				// Update display immediately to avoid event snapping back for
				// a moment after dragging.
				this._mergeChangedEvent(draft)
				const updatedEvent = await this._update(draft)
				await this._mergeChangedEvent(updatedEvent)
			} catch (error) {
				// Restore the previous version of the event
				if (event) {
					this._mergeChangedEvent(event)
				}
				throw error
			}
		})
	}
}
