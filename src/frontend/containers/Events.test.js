/* @flow strict */

import moment from "moment"
import resetDateCache from "reset-date-cache"
import EventModel from "../api/Events"
import * as ef from "../models/Event.testFixtures"
import { visualforceDatetime } from "../models/serialization"
import { delay, failIfMissing } from "../testHelpers"
import Events from "./Events"

const eventsOpts = {
	eventCreateFieldSet: ef.eventCreateFieldSet,
	remoteObject: EventModel
}

const createSpy = jest.spyOn(EventModel, "create")
const describeSpy = jest.spyOn(EventModel, "describe")
const retrieveSpy = jest.spyOn(EventModel, "retrieve")
const updateSpy = jest.spyOn(EventModel, "update")

afterEach(() => {
	jest.clearAllMocks()
})

it("requests events by date range", () => {
	const events = new Events(eventsOpts)
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
	const events = new Events(eventsOpts)
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
	const events = new Events(eventsOpts)
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

it("requests event sObject description", async () => {
	const events = new Events(eventsOpts)
	await events.fetchEventDescription()
	expect(events.state.eventDescription).toEqual(ef.eventDescription)
})

it("does not transmit event description request more than once", async () => {
	const events = new Events(eventsOpts)
	await Promise.all([
		events.fetchEventDescription(),
		events.fetchEventDescription(),
		events.fetchEventDescription()
	])
	expect(describeSpy).toHaveBeenCalledTimes(1)
})

it("initiates new event creation", async () => {
	const events = new Events(eventsOpts)
	const draft = { Subject: "event draft" }
	await events.setEventDraft(draft)
	expect(events.state).toMatchObject({
		eventDraft: {
			Subject: "event draft"
		}
	})
	expect(events.isCreatingEvent()).toBe(true)
	expect(events.isEditingEvent()).toBe(false)
})

it("sets a draft to update an existing event", async () => {
	const events = new Events(eventsOpts)
	const draft = { Id: "1", Subject: "event draft" }
	await events.setEventDraft(draft)
	expect(events.state).toMatchObject({
		eventDraft: {
			Id: "1",
			Subject: "event draft"
		}
	})
	expect(events.isCreatingEvent()).toBe(false)
	expect(events.isEditingEvent()).toBe(true)
})

it("discards the event draft", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft({ Subject: "event draft" })
	expect(events.state.eventDraft).toBeTruthy()
	await events.discardEventDraft()
	expect(events.state.eventDraft).toBeFalsy()
})

it("creates a new event from a draft", async () => {
	const events = new Events(eventsOpts)
	const draft = { Subject: "event draft" }
	await events.setEventDraft(draft)
	await events.saveDraft()
	expect(createSpy).toHaveBeenCalledWith(draft)
})

it("updates an existing event based on changes in a draft", async () => {
	const events = new Events(eventsOpts)
	const draft = { Id: "1", Subject: "event draft" }
	await events.setEventDraft(draft)
	await events.saveDraft()
	expect(updateSpy).toHaveBeenCalledWith(["1"], draft)
})

it("removes draft event from state on successful create", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft({ Subject: "event draft" })
	await events.saveDraft()
	expect(events.state.errors).toEqual([])
	expect(events.state.eventDraft).toBeFalsy()
})

it("removes draft event from state on successful update", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft({ Id: "1", Subject: "event draft" })
	await events.saveDraft()
	expect(events.state.errors).toEqual([])
	expect(events.state.eventDraft).toBeFalsy()
})

it("adds a new event to events list on creation", async () => {
	const events = new Events(eventsOpts)
	const StartDateTime = new Date("2018-06-29T17:00Z")
	const EndDateTime = new Date("2018-06-29T18:00Z")
	await events.setEventDraft({
		Subject: "event draft",
		StartDateTime,
		EndDateTime
	})
	await events.saveDraft()
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

it("it updates events list with updated event", async () => {
	const events = new Events(eventsOpts)
	const StartDateTime = new Date("2018-06-29T17:00Z")
	const EndDateTime = new Date("2018-06-29T18:00Z")
	const event = ef.events[0]
	await events.setState({ events: [event] })
	await events.setEventDraft({ ...event, Subject: "Call" })

	expect(events.state.events).toHaveLength(1)
	expect(events.state.events[0]).toHaveProperty("Subject", "Meeting")

	await events.saveDraft()
	expect(events.state.events).toHaveLength(1)
	expect(events.state.events[0]).toHaveProperty("Subject", "Call")
})
