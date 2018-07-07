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
	newEvent: ?$Shape<Event>
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
			newEvent: null
		}
	}

	isLoading(): boolean {
		return isLoading(this)
	}

	getErrors(): Error[] {
		return this.state.errors
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
	async newEvent(details: $Shape<Event>): Promise<void> {
		await this.setState({ newEvent: details })
	}

	async discardNewEvent(): Promise<void> {
		await this.setState({
			newEvent: null
		})
	}

	async create(): Promise<void> {
		await asyncAction(this, async () => {
			const draft = this.state.newEvent
			if (!draft) {
				throw new Error("There is no event draft to create.")
			}
			const Id = await this._remoteObject.create(draft)
			const event = { ...draft, Id }
			await this.setState(state => ({
				events: state.events.concat([event]),
				newEvent: null
			}))
		})
	}
}
