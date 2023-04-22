/* @flow strict */

import { type EventObjectInput } from "fullcalendar"
import moment from "moment-timezone"
import { type MomentInput, disambiguateTimezone, hasTime } from "../util/moment"
import { type Account, getId } from "./Account"

type Id = string

export type Event = {
	EndDateTime: Date | number, // Date may be provided as milliseconds since epoch
	Description: string,
	Id: string,
	IsAllDayEvent: boolean,
	OwnerId?: Id,
	ShowAs?: string,
	StartDateTime: Date | number,
	Subject: string,
	WhatId?: Id,
	Color__c?: string
}

export const defaultTimedEventDuration: moment$MomentDuration = moment.duration(
	1,
	"hour"
)

/*
 * Convert a Salesforce Event record into a value that can be given to
 * Fullcalendar for display.
 */
export function forFullcalendar(
	timezone: string,
	event: Event
): EventObjectInput {
	return {
		title: event.Subject,
		start: dateForFullcalendar(timezone, event.StartDateTime),
		end: event.IsAllDayEvent
			? endDateForFullcalendar(timezone, event.EndDateTime)
			: dateForFullcalendar(timezone, event.EndDateTime),
		allDay: Boolean(event.IsAllDayEvent),
		editable: true,
		type: "Event",
		id: event.Id,
		backgroundColor: event.Color__c
	}
}

/*
 * Fullcalendar does not handle timezone conversions when displaying events.
 * This function ensures that Moment values provided to Fullcalendar use
 * a consistent time zone.
 */
export function dateForFullcalendar(
	timezone: string,
	date: MomentInput
): moment$Moment {
	return moment(date).tz(timezone)
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
function endDateForFullcalendar(
	timezone: string,
	date: MomentInput
): moment$Moment {
	return moment(date)
		.tz(timezone)
		.add(1, "day")
}

export function newEvent({
	account,
	allDay = false,
	date,
	timezone
}: {
	account: Account,
	allDay?: boolean,
	date: moment$Moment,
	timezone: string
}): $Shape<Event> {
	const start =
		!hasTime(date) && !allDay
			? disambiguateTimezone(timezone, date)
					// $FlowFixMe type defs do not include timezone extentions
					.tz(timezone)
					.hours(10)
					.minutes(0)
					.startOf("minute")
			: disambiguateTimezone(timezone, date)
	const end = allDay
		? start.clone()
		: start.clone().add(defaultTimedEventDuration)
	return {
		WhatId: getId(account),
		StartDateTime: start.toDate(),
		EndDateTime: end.toDate(),
		IsAllDayEvent: allDay
	}
}

export function updateStartEnd({
	event,
	calEvent,
	delta,
	timezone
}: {
	event: Event,
	calEvent: EventObjectInput, // data from Fullcalendar `eventDrop` callback
	delta: moment$MomentDuration,
	timezone: string
}): Event {
	// The way that Fullcalendar reports start and end times for
	// all-day events is problematic. So in that case we transform
	// times by the given delta instead.
	if (calEvent.allDay) {
		return {
			...event,
			StartDateTime: moment(event.StartDateTime)
				.add(delta)
				.toDate(),
			EndDateTime: moment(event.EndDateTime)
				.add(delta)
				.toDate(),
			IsAllDayEvent: calEvent.allDay
		}
	}

	const origStart = moment(event.StartDateTime)
	const origEnd = moment(event.EndDateTime)
	const duration = moment.duration(origEnd.diff(origStart))
	const start = calEvent.start
		? disambiguateTimezone(timezone, moment(calEvent.start))
		: origStart

	return {
		...event,
		StartDateTime: start.toDate(),
		EndDateTime: start
			.clone()
			// When switching from an all-day event to a non-all-day event, use
			// the default event duration. Otherwise preserve the previously-defined
			// event duration.
			.add(event.IsAllDayEvent ? defaultTimedEventDuration : duration)
			.toDate(),
		IsAllDayEvent: calEvent.allDay
	}
}

/*
 * `updateEnd` moves the event's end time according to the given delta.
 */
export function updateEnd({
	event,
	delta
}: {
	event: Event,
	delta: moment$MomentDuration
}): Event {
	return {
		...event,
		EndDateTime: moment(event.EndDateTime)
			.add(delta)
			.toDate()
	}
}
