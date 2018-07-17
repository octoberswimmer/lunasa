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

import moment from "moment"
import { Container } from "unstated"
import Events, { type Event } from "../api/Events"
import type RemoteObject from "../api/RemoteObject"
import { type RestApi } from "../api/RestApi"
import { type Criteria } from "../api/SObject"
import { type FieldSet } from "../models/FieldSet"
import { visualforceDatetime } from "../models/serialization"
import {
	type SObjectDescription,
	getRelationshipName
} from "../models/SObjectDescription"
import { type Record } from "../models/QueryResult"
import { stringifyCondition } from "../models/WhereCondition"
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
	referenceData: { [key: Id]: Record } // map from Event IDs to What and Who properties
}

export default class EventContainer extends Container<State> {
	_remoteObject: RemoteObject<Event>
	_restClient: Promise<RestApi>

	// Memoized API interfaces
	_fetchEvents: (query: Criteria<Event>) => Promise<void>
	_fetchEventDescription: () => Promise<void>
	_fetchReferenceData: (eventId: Id) => Promise<void>
	_requestEvents: (query: Criteria<Event>) => Promise<Event[]>

	constructor(opts: {
		eventCreateFieldSet: FieldSet,
		remoteObject?: RemoteObject<Event>,
		restClient: Promise<RestApi>
	}) {
		super()
		this._remoteObject = opts.remoteObject || Events
		this._restClient = opts.restClient
		this.state = {
			...asyncActionInitState,
			events: [],
			eventCreateFieldSet: opts.eventCreateFieldSet,
			eventDescription: null,
			eventDraft: null,
			referenceData: {}
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
		if (!eventId) {
			return
		}
		const data = this.state.referenceData[eventId]
		const description = this.state.eventDescription
		if (!data) {
			this._fetchReferenceData(eventId)
		}
		if (!description) {
			this._fetchEventDescription()
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
		// Clone input values because most moment methods mutate their input
		const start = rangeStart
			.clone()
			.local()
			.startOf("day")
		const end = rangeEnd
			.clone()
			.local()
			.endOf("day")
		return this._fetchEvents({
			where: {
				and: {
					StartDateTime: { lt: visualforceDatetime(end) },
					EndDateTime: { gt: visualforceDatetime(start) }
				}
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

	async _fetchReferenceData(eventId: Id): Promise<void> {
		await asyncAction(this, async () => {
			const where = stringifyCondition({
				field: "Id",
				operator: "equals",
				values: [`'${eventId}'`]
			})
			// Limit fetched relationship  data to `Name` fields from `What` and
			// `Who` for now.
			const query = `SELECT What.Name, Who.Name FROM Event WHERE ${where}`
			const client = await this._restClient
			const result = await client.query(query)
			const matchingRecord = result.records[0]
			if (matchingRecord) {
				await this.setState(state => ({
					referenceData: { ...state.referenceData, [eventId]: matchingRecord }
				}))
			}
		})
	}

	/*
	 * Create or update a draft event
	 */
	async setEventDraft(details: $Shape<Event>): Promise<void> {
		await this.setState({ eventDraft: details })
	}

	async discardEventDraft(): Promise<void> {
		await this.setState({
			eventDraft: null
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
			return {
				events: events.concat([event]),
				eventDraft: null
			}
		})
	}

	async updateStartEnd({
		eventId,
		startDelta,
		endDelta,
		isAllDay
	}: {
		eventId: Id | number | void,
		startDelta?: moment$MomentDuration,
		endDelta?: moment$MomentDuration,
		isAllDay?: boolean
	}): Promise<void> {
		await asyncAction(this, async () => {
			const event = this.getEvent(eventId)
			try {
				if (!event) {
					throw new Error("Could not locate event record.")
				}
				const draft = { ...event }
				if (startDelta) {
					draft.StartDateTime = moment(event.StartDateTime)
						.add(startDelta)
						.toDate()
				}
				if (endDelta) {
					draft.EndDateTime = moment(event.EndDateTime)
						.add(endDelta)
						.toDate()
				}
				if (typeof isAllDay === "boolean") {
					draft.IsAllDayEvent = isAllDay
				}
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
