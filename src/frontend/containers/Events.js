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

import equal from "fast-deep-equal"
import { Container } from "unstated"
import Events, { type Event } from "../api/Events"
import type RemoteObject from "../api/RemoteObject"
import { type Criteria } from "../api/SObject"
import { type FieldSet } from "../models/FieldSet"
import { visualforceDatetime } from "../models/serialization"
import { type SObjectDescription } from "../models/SObjectDescription"
import {
	type AsyncActionState,
	asyncAction,
	asyncActionInitState,
	isLoading
} from "./asyncAction"

export type State = AsyncActionState & {
	events: Event[],
	eventCreateFieldSet: FieldSet,
	eventDescription: ?SObjectDescription,
	eventDraft: ?$Shape<Event>
}

export default class EventContainer extends Container<State> {
	_remoteObject: RemoteObject<Event>
	_requestedDescription: boolean
	_latestQuery: ?Criteria<Event>

	constructor(opts: {
		eventCreateFieldSet: FieldSet,
		remoteObject?: RemoteObject<Event>
	}) {
		super()
		this._remoteObject = opts.remoteObject || Events
		this.state = {
			...asyncActionInitState,
			events: [],
			eventCreateFieldSet: opts.eventCreateFieldSet,
			eventDescription: null,
			eventDraft: null
		}
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

	getEvent(id: string | number | void): ?Event {
		if (id) {
			return this.state.events.find(e => e.Id === id)
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
		return this._getEvents({
			where: {
				and: {
					StartDateTime: { lt: visualforceDatetime(end) },
					EndDateTime: { gt: visualforceDatetime(start) }
				}
			}
		})
	}

	async _getEvents(query: Criteria<Event>): Promise<void> {
		// Check if the given range is the same as the most recently requested
		// range. Without this check we will get stuck in a loop.
		if (equal(query, this._latestQuery)) {
			return
		}
		this._latestQuery = query
		return asyncAction(this, async () => {
			const events = await this._remoteObject.retrieve(query)
			// If another request was started while this one was in progress
			// then the query here will not match the latest query.
			if (equal(query, this._latestQuery)) {
				await this.setState({ events })
			}
		})
	}

	async fetchEventDescription(): Promise<void> {
		if (this._requestedDescription) {
			return
		}
		this._requestedDescription = true
		await asyncAction(this, async () => {
			const eventDescription = await this._remoteObject.describe()
			await this.setState({ eventDescription })
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
			await this.setState(state => {
				const events = state.events.filter(e => e.Id !== event.Id)
				return {
					events: events.concat([event]),
					eventDraft: null
				}
			})
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
}
