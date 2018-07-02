/* @flow strict */

import { type EventObjectInput } from "fullcalendar"
import { type Account } from "./Account"

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

export function newEvent({
	account,
	date
}: {
	account: Account,
	date: moment$Moment
}): $Shape<Event> {
	return {
		StartDateTime: date
			.clone()
			.local()
			.hours(10)
			.minutes(0)
			.startOf("minute")
			.toDate(),
		EndDateTime: date
			.clone()
			.local()
			.hours(11)
			.minutes(0)
			.startOf("minute")
			.toDate(),
		Subject: `Meeting with ${account.Name}`
	}
}
