/* @flow strict */

import { type Event } from "../models/Event"
import { type SObject } from "./SObject"
import RemoteObject from "./RemoteObject"

export type { Event } from "../models/Event"

// Visualforce injects the Event class into the global namespace
declare var Lunasa: {
	Event: Class<SObject<Event>>
}

// Load mock API module in development, production module in production. This is
// written using the `import` statement so that the development module is not
// included in the combined js file that is deployed to production. The
// production module is imported in a line at the top of the file so that it
// *is* included in the combined file - otherwise Webpack would split the
// combined js into two files.
//
// When Webpack encounters the condition `process.env.NODE_ENV === "production"`
// in non-async code it will inline the branch where that condition is true when
// building the production bundle. Webpack will remove the condition and the
// `else` branch.
const EventModel: Promise<SObject<Event>> =
	process.env.NODE_ENV !== "production"
		? import("./Events.development.js").then(module => module.default)
		: new Lunasa.Event()

function transformAfterRetrieve(record: Event): Event {
	// If `IsAllDay` is set then the start and end times will be set to midnight
	// of the given date UTC. Transform to the appropriate local time zone.
	if (record.IsAllDayEvent) {
		return {
			...record,
			StartDateTime: dateToLocalTz(record.StartDateTime),
			EndDateTime: dateToLocalTz(record.EndDateTime)
		}
	}
	return record
}

function isMidnightUTC(date: Date): boolean {
	return date.getUTCHours() === 0 && date.getUTCMinutes() === 0
}

function dateToLocalTz<T: Date | number | void>(input: T): T {
	if (!input) {
		return input
	}
	const date = new Date(input)
	return isMidnightUTC(date)
		? new Date(
				date.getUTCFullYear(),
				date.getUTCMonth(),
				date.getUTCDate(),
				0,
				0
		  )
		: date
}

export default new RemoteObject(EventModel, { transformAfterRetrieve })
