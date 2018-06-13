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
