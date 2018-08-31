/* @flow strict */

import moment from "moment-timezone"
import EventModel from "../api/Events"
import RestApi from "../api/RestApi"
import * as af from "../models/Account.testFixtures"
import * as ef from "../models/Event.testFixtures"
import { type QueryResult } from "../models/QueryResult"
import { visualforceDatetime } from "../models/serialization"
import { delay, failIfMissing, withTimezone } from "../testHelpers"
import Events from "./Events"

const restClient = RestApi("0000")
const timezone = moment.tz.guess()

const eventsOpts = {
	eventCreateFieldSet: ef.eventCreateFieldSet,
	eventRecordTypeInfos: ef.eventRecordTypeInfos,
	remoteObject: EventModel,
	restClient,
	timezone,
	userId: "testuserid"
}

afterEach(() => {
	jest.clearAllMocks()
	// Remove spies from `EventModel`
	for (const method of Object.values(EventModel)) {
		if (method && typeof method.mockRestore === "function") {
			method.mockRestore()
		}
	}
})

it("requests events by date range", () => {
	const retrieve = jest.spyOn(EventModel, "retrieve")
	const events = new Events(eventsOpts)
	const today = moment()
	events.getEventsByDateRange(today, today)
	expect(retrieve).toHaveBeenCalledTimes(1)
	expect(retrieve).toHaveBeenCalledWith({
		where: {
			StartDateTime: { lt: visualforceDatetime(today.endOf("day")) },
			EndDateTime: { gt: visualforceDatetime(today.startOf("day")) },
			OwnerId: { eq: eventsOpts.userId }
		}
	})
})

it("sets time range to start and end of day in the user's time zone", () => {
	const retrieve = jest.spyOn(EventModel, "retrieve")

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
		const events = new Events({ ...eventsOpts, timezone: tz })
		events.getEventsByDateRange(moment.utc(inputTime), moment.utc(inputTime))
		expect(retrieve).toHaveBeenCalledWith({
			where: {
				StartDateTime: { lt: expectedEnd },
				EndDateTime: { gt: expectedStart },
				OwnerId: { eq: eventsOpts.userId }
			}
		})
	}
})

it("avoids making the same query twice in a row", () => {
	const retrieve = jest.spyOn(EventModel, "retrieve")
	const events = new Events(eventsOpts)
	const today = moment()
	events.getEventsByDateRange(today, today)
	events.getEventsByDateRange(today, today)
	expect(retrieve).toHaveBeenCalledTimes(1)
	expect(retrieve).toHaveBeenCalledWith({
		where: {
			StartDateTime: { lt: visualforceDatetime(today.endOf("day")) },
			EndDateTime: { gt: visualforceDatetime(today.startOf("day")) },
			OwnerId: { eq: eventsOpts.userId }
		}
	})
})

it("requests event sObject description", async () => {
	const events = new Events(eventsOpts)
	events.getEventDescription() // trigger fetch
	await delay() // wait for fetch to complete
	const description = events.getEventDescription()
	expect(description).toEqual(ef.eventDescription)
})

it("does not transmit event description request more than once", async () => {
	const describe = jest.spyOn(EventModel, "describe")
	const events = new Events(eventsOpts)
	events.getEventDescription()
	events.getEventDescription()
	await delay()
	events.getEventDescription()
	events.getEventDescription()
	expect(describe).toHaveBeenCalledTimes(1)
})

it("requests layout metadata for the user's default event record type", async () => {
	// Use `Offsite_Events` as the default record type
	const eventRecordTypeInfos = ef.eventRecordTypeInfos.map(rt => ({
		...rt,
		defaultRecordTypeMapping: rt.developerName === "Offsite_Events"
	}))
	const events = new Events({ ...eventsOpts, eventRecordTypeInfos })
	events.getEventLayout() // trigger fetch
	await delay()
	const layout = events.getEventLayout()
	expect(layout).toEqual(ef.offsiteEventLayout)
})

it("does not transmit request for layout more than once", async () => {
	const client = await restClient
	jest.spyOn(client, "fetchLayout")
	const events = new Events(eventsOpts)
	events.getEventLayout()
	events.getEventLayout()
	await delay()
	events.getEventLayout()
	events.getEventLayout()
	expect(client.fetchLayout).toHaveBeenCalledTimes(1)
})

it("gets data from a referenced record", async () => {
	const referencedRecords = {
		What: {
			Name: "Account Name",
			attributes: {
				type: "Account",
				url: "/sobjects/Account/someAccountId"
			}
		},
		attributes: {
			type: "Event",
			url: "/sobjects/Account/someEventId"
		}
	}
	const client = await restClient
	jest.spyOn(client, "query").mockImplementation(
		async (query: string): Promise<QueryResult> => {
			if (
				query.match(/SELECT.*What\.Name.*FROM Event.*WHERE Id = 'someEventId'/)
			) {
				return {
					done: true,
					totalSize: 1,
					records: [referencedRecords]
				}
			} else {
				return {
					done: true,
					totalSize: 0,
					records: []
				}
			}
		}
	)
	const events = new Events(eventsOpts)
	events.getReference("WhatId", "someEventId") // trigger fetch
	await delay() // wait for fetch to complete
	const what = events.getReference("WhatId", "someEventId")
	expect(events.state.errors).toEqual([])
	expect(what).toEqual(referencedRecords.What)
})

it("does not transmit reference request more than once per event ID", async () => {
	const client = await restClient
	const query = jest.spyOn(client, "query")
	const events = new Events(eventsOpts)
	events.getReference("WhatId", "1")
	events.getReference("WhoId", "1")
	events.getReference("WhatId", "2")
	events.getReference("WhatId", "2")
	events.getReference("WhatId", "1")
	await delay()
	expect(query).toHaveBeenCalledTimes(2)
	expect(query).toHaveBeenCalledWith(
		expect.stringMatching(/SELECT.*FROM Event.*WHERE Id = '1'/)
	)
	expect(query).toHaveBeenCalledWith(
		expect.stringMatching(/SELECT.*FROM Event.*WHERE Id = '2'/)
	)
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

it("stores account information for display with new event", async () => {
	const events = new Events(eventsOpts)
	const account = failIfMissing(
		af.accountQueryResult.records.find(a => a.Name === "Edge Communications")
	)
	const draft = { Subject: "event draft" }
	await events.setEventDraft(draft, account)
	events.getReference("WhatId", undefined) // trigger fetch for event description
	await delay()
	expect(events.getReference("WhatId", undefined)).toEqual(account)
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

it("clears link to referenced account when discarding draft", async () => {
	const events = new Events(eventsOpts)
	const account = failIfMissing(
		af.accountQueryResult.records.find(a => a.Name === "Edge Communications")
	)
	const draft = { Subject: "event draft" }
	await events.setEventDraft(draft, account)
	expect(events.state.referenceData.draft).toEqual({ What: account })
	await events.discardEventDraft()
	expect(events.state.referenceData.draft).not.toBeDefined()
})

it("creates a new event from a draft", async () => {
	const create = jest.spyOn(EventModel, "create")
	const events = new Events(eventsOpts)
	const draft = { Subject: "event draft" }
	await events.setEventDraft(draft)
	await events.saveDraft()
	expect(create).toHaveBeenCalledWith(draft)
})

it("updates an existing event based on changes in a draft", async () => {
	const update = jest.spyOn(EventModel, "update")
	const events = new Events(eventsOpts)
	const draft = { Id: "1", Subject: "event draft" }
	await events.setEventDraft(draft)
	await events.saveDraft()
	expect(update).toHaveBeenCalledWith(["1"], draft)
})

it("removes draft event from state on successful create", async () => {
	const events = new Events(eventsOpts)
	const account = failIfMissing(
		af.accountQueryResult.records.find(a => a.Name === "Edge Communications")
	)
	await events.setEventDraft({ Subject: "event draft" }, account)
	await events.saveDraft()
	expect(events.state.errors).toEqual([])
	expect(events.state.eventDraft).toBeFalsy()
	expect(events.state.referenceData.draft).not.toBeDefined()
})

it("removes draft event from state on successful update", async () => {
	const events = new Events(eventsOpts)
	const account = failIfMissing(
		af.accountQueryResult.records.find(a => a.Name === "Edge Communications")
	)
	await events.setEventDraft({ Id: "1", Subject: "event draft" }, account)
	await events.saveDraft()
	expect(events.state.errors).toEqual([])
	expect(events.state.eventDraft).toBeFalsy()
	expect(events.state.referenceData.draft).not.toBeDefined()
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

it("changes the start and end times of an event", async () => {
	const inputs = [
		{
			origStart: "2018-07-17T10:00+02:00",
			origEnd: "2018-07-17T11:00+02:00",
			expectedStart: "2018-07-15T10:00+02:00",
			expectedEnd: "2018-07-15T11:00+02:00",
			tz: "Europe/Berlin"
		},
		{
			origStart: "2018-07-17T10:00-07:00",
			origEnd: "2018-07-17T11:00-07:00",
			expectedStart: "2018-07-15T10:00-07:00",
			expectedEnd: "2018-07-15T11:00-07:00",
			tz: "America/Los_Angeles"
		},
		{
			origStart: "2018-07-17T10:00Z",
			origEnd: "2018-07-17T11:00Z",
			expectedStart: "2018-07-15T10:00Z",
			expectedEnd: "2018-07-15T11:00Z",
			tz: "UTC"
		}
	]
	expect.assertions(inputs.length * 2)
	for (const { origStart, origEnd, expectedStart, expectedEnd, tz } of inputs) {
		await withTimezone(tz, async () => {
			const events = new Events(eventsOpts)
			const StartDateTime = new Date(origStart)
			const EndDateTime = new Date(origEnd)
			const event = ef.events[0]
			await events.setState({
				events: [{ ...event, StartDateTime, EndDateTime }]
			})
			await events.updateStartEnd({
				calEvent: ({
					id: event.Id,
					start: moment(expectedStart)
				}: any),
				delta: moment.duration(-2, "days")
			})

			expect(events.state.events).toHaveLength(1)
			expect(events.state.events[0]).toMatchObject({
				StartDateTime: new Date(expectedStart),
				EndDateTime: new Date(expectedEnd)
			})
		})
	}
})

it("changes the end date of an event", async () => {
	const inputs = [
		{
			start: "2018-07-17T10:00+02:00",
			origEnd: "2018-07-17T11:00+02:00",
			expectedEnd: "2018-07-18T11:00+02:00",
			tz: "Europe/Berlin"
		},
		{
			start: "2018-07-17T10:00-07:00",
			origEnd: "2018-07-17T11:00-07:00",
			expectedEnd: "2018-07-18T11:00-07:00",
			tz: "America/Los_Angeles"
		},
		{
			start: "2018-07-17T10:00Z",
			origEnd: "2018-07-17T11:00Z",
			expectedEnd: "2018-07-18T11:00Z",
			tz: "UTC"
		}
	]
	expect.assertions(inputs.length * 2)
	for (const { start, origEnd, expectedEnd, tz } of inputs) {
		await withTimezone(tz, async () => {
			const events = new Events(eventsOpts)
			const StartDateTime = new Date(start)
			const EndDateTime = new Date(origEnd)
			const event = ef.events[0]
			await events.setState({
				events: [{ ...event, StartDateTime, EndDateTime }]
			})
			await events.updateEnd({
				calEvent: ({
					id: event.Id
				}: any),
				delta: moment.duration(1, "days")
			})

			expect(events.state.events).toHaveLength(1)
			expect(events.state.events[0]).toMatchObject({
				StartDateTime: new Date(start),
				EndDateTime: new Date(expectedEnd)
			})
		})
	}
})

it("reverts a change if an error occurs updating event start and end times", async () => {
	jest
		.spyOn(EventModel, "update")
		.mockReturnValue(Promise.reject(new Error("Error sending update.")))
	const events = new Events(eventsOpts)
	const event = ef.events[0]
	const StartDateTime = new Date("2018-07-17T10:00-07:00")
	const EndDateTime = new Date("2018-07-17T11:00-07:00")
	await events.setState({
		events: [{ ...event, StartDateTime, EndDateTime }]
	})
	await events.updateStartEnd({
		calEvent: ({
			id: event.Id,
			start: moment("2018-07-18T10:00-07:00")
		}: any),
		delta: moment.duration(1, "days")
	})
	expect(events.state.events[0]).toMatchObject({
		StartDateTime,
		EndDateTime
	})
})
