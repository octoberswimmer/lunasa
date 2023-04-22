/* @flow strict */

import moment from "moment-timezone"
import { withTimezone } from "../testHelpers"
import { sameMoment } from "../test/customExpect"
import { setTimezone, stripZone } from "../util/moment"
import {
	type Event,
	defaultTimedEventDuration,
	forFullcalendar,
	newEvent
} from "./Event"
import * as ef from "./Event.testFixtures"

const timezone = moment.tz.guess()

const testEvent: Event = {
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
	const event = newEvent({ account, date, timezone })
	expect(event.WhatId).toBe("001f200001XrDswAAF")
})

it("sets default start and end time for event draft", async () => {
	const inputs = [
		{ expected: "2018-07-05T10:00-07:00", tz: "America/Los_Angeles" },
		{ expected: "2018-07-05T10:00+02:00", tz: "Europe/Berlin" },
		{ expected: "2018-07-05T10:00Z", tz: "UTC" }
	]
	expect.assertions(inputs.length * 2)
	for (const { expected, tz } of inputs) {
		await withTimezone(tz, async () => {
			const date = moment.tz("2018-07-05", tz)
			// $FlowFixMe
			date.hasTime = () => false
			const event = newEvent({ account, date, timezone: tz })
			expect(event.StartDateTime).toEqual(sameMoment(expected))
			expect(event.EndDateTime).toEqual(
				sameMoment(moment(expected).add(defaultTimedEventDuration))
			)
		})
	}
})

it("sets `IsAllDayEvent` if given the `allDay` flag", () => {
	const date = moment()
	const event = newEvent({ account, allDay: true, date, timezone })
	expect(event.IsAllDayEvent).toBe(true)
})

it("sets default start and end time if given date has ambiguous time", () => {
	const date = moment()
	// $FlowFixMe
	date.hasTime = () => false
	const event = newEvent({ account, date, timezone })
	expect(setTimezone(timezone, event.StartDateTime).hours()).toBe(10)
	expect(setTimezone(timezone, event.StartDateTime).minutes()).toBe(0)
	expect(setTimezone(timezone, event.EndDateTime).hours()).toBe(11)
	expect(setTimezone(timezone, event.EndDateTime).minutes()).toBe(0)
})

it("fixes time zone information for event start time reported by fullcalendar", async () => {
	const inputs = [
		{
			expected: "2018-07-05T09:30-07:00",
			userTz: "America/Los_Angeles",
			browserTz: "Europe/Berlin"
		},
		{
			expected: "2018-07-05T09:30+02:00",
			userTz: "Europe/Berlin",
			browserTz: "America/Los_Angeles"
		},
		{
			expected: "2018-07-05T09:30Z",
			userTz: "UTC",
			browserTz: "America/Los_Angeles"
		}
	]
	expect.assertions(inputs.length * 2)
	for (const { expected, userTz, browserTz } of inputs) {
		await withTimezone(browserTz, async () => {
			// Fullcalendar provides date values with an ambiguous timezone.
			const date = stripZone(moment("2018-07-05T09:30"))
			const event = newEvent({ account, date, timezone: userTz })
			expect(event.StartDateTime).toEqual(sameMoment(expected))
			expect(event.EndDateTime).toEqual(
				sameMoment(moment(expected).add(defaultTimedEventDuration))
			)
		})
	}
})

it("produces data for a FullCalendar event", () => {
	const event = forFullcalendar(timezone, testEvent)
	expect(event).toMatchObject({
		title: "Meeting",
		start: sameMoment(testEvent.StartDateTime),
		end: sameMoment(testEvent.EndDateTime),
		allDay: false,
		editable: true,
		type: "Event",
		id: "1"
	})
})

it("sets the 'allDay' flag in FullCalendar if appropriate", () => {
	const event = forFullcalendar(timezone, { ...testEvent, IsAllDayEvent: true })
	expect(event).toHaveProperty("allDay", true)
})

it("sets the 'backgroundColor' flag in FullCalendar if appropriate", () => {
	const event = forFullcalendar(timezone, { ...testEvent, Color__c: "Purple" })
	expect(event).toHaveProperty("backgroundColor", "Purple")
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
	const event = forFullcalendar(timezone, {
		...testEvent,
		EndDateTime: new Date("2018-07-12T00:00-07:00"),
		IsAllDayEvent: true
	})
	expect(event.end).toEqual(sameMoment("2018-07-13T00:00-07:00"))
})
