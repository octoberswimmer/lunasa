/* @flow strict */

import { type EventObjectInput } from "fullcalendar"
import { type Account, getId } from "./Account"

type Id = string

export type Event = {
	EndDateTime: Date,
	Description: string,
	Id: string,
	IsAllDayEvent: boolean,
	StartDateTime: Date,
	Subject: string,
	WhatId?: Id
}

/*
 * Convert a Salesforce Event record into a value that can be given to
 * Fullcalendar for display.
 */
export function forFullcalendar(event: Event): EventObjectInput {
	return {
		title: event.Subject,
		start: event.StartDateTime,
		end: event.EndDateTime,
		type: "Event",
		id: event.Id
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
		WhatId: getId(account),
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
			.toDate()
	}
}
