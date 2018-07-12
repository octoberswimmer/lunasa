/* @flow strict */

import moment from "moment"
import { type Event, forFullcalendar, newEvent } from "./Event"
import * as ef from "./Event.testFixtures"

export const testEvent: Event = {
	Id: "1",
	EndDateTime: moment()
		.endOf("hour")
		.toDate(),
	Description: "test event",
	IsAllDayEvent: false,
	StartDateTime: moment()
		.startOf("hour")
		.toDate(),
	Subject: "Meeting"
}

const account = {
	attributes: {
		type: "test",
		url: "/services/data/v40.0/sobjects/Account/001f200001XrDswAAF"
	},
	CreatedDate: "2018-06-01T20:35:50.000+0000",
	Name: "Test Account",
	Phone: "(520) 773-9050",
	Site: null
}

it("creates a new event draft from an account and a date", () => {
	const date = moment()
	const event = newEvent({ account, date })
	expect(event.WhatId).toBe("001f200001XrDswAAF")
})

it("sets default start and end time for event draft", () => {
	const date = moment()
	const event = newEvent({ account, date })
	const start = moment(event.StartDateTime)
	const end = moment(event.EndDateTime)
	expect(start.isSame(date, "day")).toBe(true)
	expect(end.isSame(date, "day")).toBe(true)
	expect(start.isBefore(end))
})

it("produces data for a FullCalendar event", () => {
	const event = forFullcalendar(testEvent)
	expect(event).toMatchObject({
		title: "Meeting",
		start: testEvent.StartDateTime,
		end: testEvent.EndDateTime,
		allDay: false,
		type: "Event",
		id: "1"
	})
})

it("sets the 'allDay' flag in FullCalendar if appropriate", () => {
	const event = forFullcalendar({ ...testEvent, IsAllDayEvent: true })
	expect(event).toHaveProperty("allDay", true)
})

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
it("adds one day to the `end` date for all-day events", () => {
	const event = forFullcalendar({
		...testEvent,
		EndDateTime: new Date("2018-07-12T00:00-07:00"),
		IsAllDayEvent: true
	})
	expect(event.end).toEqual(new Date("2018-07-13T00:00-07:00"))
})
