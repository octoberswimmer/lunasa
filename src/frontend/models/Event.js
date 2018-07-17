/* @flow strict */

import { type EventObjectInput } from "fullcalendar"
import moment from "moment"
import { type Account, getId } from "./Account"

type Id = string

export type Event = {
	EndDateTime: Date | number, // Date may be provided as milliseconds since epoch
	Description: string,
	Id: string,
	IsAllDayEvent: boolean,
	StartDateTime: Date | number,
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
		end: event.IsAllDayEvent
			? endDateForFullcalendar(event.EndDateTime)
			: event.EndDateTime,
		allDay: Boolean(event.IsAllDayEvent),
		editable: true,
		type: "Event",
		id: event.Id
	}
}

/*
 * There is a bug in FullCalendar that causes an all-day event to displayed
 * ending one day earlier than it should. For example if the `start` and `end`
 * are on the same day the event is not displayed at all - its duration is zero.
 *
 * To work around this we add one day to the `end` date when displaying all-day
 * events.
 *
 * See: https://github.com/fullcalendar/fullcalendar/issues/3854
 */
function endDateForFullcalendar(date: Date | number): Date {
	return moment(date)
		.add(1, "day")
		.toDate()
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
