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

it("produces data for a Full Calendar event", () => {
	const event = forFullcalendar(testEvent)
	expect(event).toMatchObject({
		title: "Meeting",
		start: testEvent.StartDateTime,
		end: testEvent.EndDateTime,
		type: "Event",
		id: "1"
	})
})
