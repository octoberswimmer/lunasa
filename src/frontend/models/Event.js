/* @flow strict */

import { type EventObjectInput } from "fullcalendar"

export type Event = {
	EndDateTime: Date,
	Description: string,
	Id: string,
	IsAllDayEvent: boolean,
	StartDateTime: Date,
	Subject: string
}

/*
 * Visualforce requires datetime values to be in the UTC time zone in a *very*
 * *specific* format: an RFC 3339 string with whole-second precision, no
 * fractional seconds, and no time zone indicator. Use this format string with
 * moment's `.format()` method to get the appropriate string. For example:
 *
 *     moment(someDate).utc().format(RFC_3339)
 */
const RFC_3339 = "YYYY-MM-DDTHH:mm:ss"

/*
 * Creates a string representation of a date value suitable for consumption by
 * Visualforce.
 */
export function visualforceDatetime(datetime: moment$Moment) {
	const string = datetime
		.clone()
		.utc()
		.format(RFC_3339)
	// When deployed to Visualforce moment produces a formatted string with the
	// letter "A" where the letter "T" should be. The reason is unclear. This
	// does not happen in local testing.
	return string.replace("A", "T")
}

/*
 * Convert a Salesforce Event record into a value that can be given to
 * Fullcalendar for display.
 */
export function forFullcalendar(event: Event): EventObjectInput {
	return {
		title: event.Subject,
		start: event.StartDateTime,
		end: event.EndDateTime
	}
}
