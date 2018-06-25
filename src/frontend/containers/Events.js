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
import { visualforceDatetime } from "../models/Event"
import {
	type AsyncActionState,
	asyncAction,
	asyncActionInitState,
	isLoading
} from "./asyncAction"

export type State = AsyncActionState & {
	events: Event[]
}

export default class EventContainer extends Container<State> {
	_remoteObject: RemoteObject<Event>
	_latestQuery: ?Criteria<Event>
	state = {
		...asyncActionInitState,
		events: []
	}

	constructor(remoteObject: RemoteObject<Event> = Events) {
		super()
		this._remoteObject = remoteObject
	}

	isLoading(): boolean {
		return isLoading(this)
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
}
