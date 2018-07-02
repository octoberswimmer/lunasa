/* @flow strict */

import moment from "moment"
import resetDateCache from "reset-date-cache"
import EventModel from "../api/Events"
import { visualforceDatetime } from "../models/serialization"
import { delay, failIfMissing } from "../testHelpers"
import Events from "./Events"

const createSpy = jest.spyOn(EventModel, "create")
const retrieveSpy = jest.spyOn(EventModel, "retrieve")

afterEach(() => {
	jest.clearAllMocks()
})

it("requests events by date range", () => {
	const events = new Events(EventModel)
	const today = moment()
	events.getEventsByDateRange(today, today)
	expect(EventModel.retrieve).toHaveBeenCalledTimes(1)
	expect(EventModel.retrieve).toHaveBeenCalledWith({
		where: {
			and: {
				StartDateTime: { lt: visualforceDatetime(today.endOf("day")) },
				EndDateTime: { gt: visualforceDatetime(today.startOf("day")) }
			}
		}
	})
})

it("sets time range to start and end of day in the local time zone", () => {
	const events = new Events(EventModel)
	const origTz = process.env.TZ

	// Data for various time zones with the following properties: an input time
	// of 2pm, the start of the same day in the local time zone, and the end of
	// the day in the local time zone.
	const fixtures = [
		{
			tz: "America/Los_Angeles",
			inputTime: "2018-01-03T22:00:00Z", // not during DST
			expectedStart: "2018-01-03T08:00:00", // format required by Visualforce (no `Z`!)
			expectedEnd: "2018-01-04T07:59:59"
		},
		{
			tz: "America/Los_Angeles",
			inputTime: "2018-06-15T21:00:00Z", // during DST
			expectedStart: "2018-06-15T07:00:00",
			expectedEnd: "2018-06-16T06:59:59"
		},
		{
			tz: "Europe/Berlin",
			inputTime: "2018-01-03T13:00:00Z", // not during DST
			expectedStart: "2018-01-02T23:00:00",
			expectedEnd: "2018-01-03T22:59:59"
		},
		{
			tz: "Europe/Berlin",
			inputTime: "2018-06-15T12:00:00Z", // during DST
			expectedStart: "2018-06-14T22:00:00",
			expectedEnd: "2018-06-15T21:59:59"
		},
		{
			tz: "UTC",
			inputTime: "2018-01-03T14:00:00Z",
			expectedStart: "2018-01-03T00:00:00",
			expectedEnd: "2018-01-03T23:59:59"
		}
	]

	for (const { tz, inputTime, expectedStart, expectedEnd } of fixtures) {
		process.env.TZ = tz
		resetDateCache()
		events.getEventsByDateRange(moment.utc(inputTime), moment.utc(inputTime))
		expect(EventModel.retrieve).toHaveBeenCalledWith({
			where: {
				and: {
					StartDateTime: { lt: expectedEnd },
					EndDateTime: { gt: expectedStart }
				}
			}
		})
	}

	process.env.TZ = origTz
	resetDateCache()
})

it("avoids making the same query twice in a row", () => {
	const events = new Events(EventModel)
	const today = moment()
	events.getEventsByDateRange(today, today)
	events.getEventsByDateRange(today, today)
	expect(EventModel.retrieve).toHaveBeenCalledTimes(1)
	expect(EventModel.retrieve).toHaveBeenCalledWith({
		where: {
			and: {
				StartDateTime: { lt: visualforceDatetime(today.endOf("day")) },
				EndDateTime: { gt: visualforceDatetime(today.startOf("day")) }
			}
		}
	})
})

it("initiates new event creation", async () => {
	const events = new Events(EventModel)
	const draft = { Subject: "event draft" }
	await events.newEvent(draft)
	expect(events.state).toMatchObject({
		newEvent: {
			Subject: "event draft"
		}
	})
})

it("discards the new event draft", async () => {
	const events = new Events(EventModel)
	await events.newEvent({ Subject: "event draft" })
	expect(events.state.newEvent).toBeTruthy()
	await events.discardNewEvent()
	expect(events.state.newEvent).toBeFalsy()
})

it("creates a new event from a draft", async () => {
	const events = new Events(EventModel)
	const draft = { Subject: "event draft" }
	await events.newEvent(draft)
	await events.create()
	expect(createSpy).toHaveBeenCalledWith(draft)
})

it("removes draft event from state on successful create", async () => {
	const events = new Events(EventModel)
	await events.newEvent({ Subject: "event draft" })
	await events.create()
	expect(events.state.errors).toEqual([])
	expect(events.state.newEvent).toBeFalsy()
})

it("adds a new event to events list on creation", async () => {
	const events = new Events(EventModel)
	const StartDateTime = new Date("2018-06-29T17:00Z")
	const EndDateTime = new Date("2018-06-29T18:00Z")
	await events.newEvent({ Subject: "event draft", StartDateTime, EndDateTime })
	await events.create()
	expect(events.state.events).toContainEqual(
		expect.objectContaining({ Subject: "event draft" })
	)
	const event = failIfMissing(
		events.state.events.find(e => e.Subject === "event draft")
	)
	expect(event.Id).toBeTruthy()
	expect(event.StartDateTime).toEqual(StartDateTime)
	expect(event.EndDateTime).toEqual(EndDateTime)
})
