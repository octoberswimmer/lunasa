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

export type State = {
	events: Event[],
	errors: Error[],
	loading: number
}

export default class EventContainer extends Container<State> {
	_remoteObject: RemoteObject<Event>
	_latestQuery: ?Criteria<Event>
	state = {
		events: [],
		errors: [],
		loading: 0
	}

	constructor(remoteObject: RemoteObject<Event> = Events) {
		super()
		this._remoteObject = remoteObject
	}

	isLoading(): boolean {
		return this.state.loading > 0
	}

	/*
	 * Fetches events from the given date range
	 */
	async getEventsByDateRange(
		start: moment$Moment,
		end: moment$Moment
	): Promise<void> {
		return this._getEvents({
			where: {
				and: {
					StartDateTime: { lt: end.endOf("day").toDate() },
					EndDateTime: { gt: start.startOf("day").toDate() }
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
		return this._asyncAction(async () => {
			const events = await this._remoteObject.retrieve(query)
			// If another request was started while this one was in progress
			// then the query here will not match the latest query.
			if (equal(query, this._latestQuery)) {
				await this.setState({ events })
			}
		})
	}

	/*
	 * Given a callback that returns a promise, sets state to indicate loading
	 * until the promise resolves, and set error state if the promise rejects.
	 * Returns a promise that is guaranteed not to reject.
	 */
	async _asyncAction<T>(cb: () => Promise<T>): Promise<void> {
		this.setState(state => ({
			errors: [],
			loading: state.loading + 1
		}))
		try {
			await cb()
		} catch (error) {
			this.setState({ errors: [error] })
		} finally {
			this.setState(state => ({ loading: state.loading - 1 }))
		}
	}
}
