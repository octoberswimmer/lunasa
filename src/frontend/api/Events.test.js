/* @flow strict */

import { type Event } from "../models/Event"
import { withTimezone } from "../testHelpers"
import Events from "./Events"
import SObjectMock from "./Events.development.js"

afterEach(() => {
	jest.resetAllMocks()
})

it("provides start and end times as dates", async () => {
	const inputs = [
		{
			start: "2018-07-08T10:00-07:00",
			end: "2018-07-08T11:00-07:00",
			tz: "America/Los_Angeles"
		},
		{
			start: "2018-07-08T10:00+02:00",
			end: "2018-07-08T11:00+02:00",
			tz: "Europe/Berlin"
		},
		{
			start: "2018-07-08T10:00Z",
			end: "2018-07-08T11:00Z",
			tz: "UTC"
		}
	]
	expect.assertions(inputs.length * 2)
	const retrieveSpy = jest.spyOn(SObjectMock, "retrieve")
	for (const { start, end, tz } of inputs) {
		await withTimezone(tz, async () => {
			retrieveSpy.mockImplementationOnce((criteria, cb) => {
				cb(null, [
					{
						_props: {
							StartDateTime: new Date(start),
							EndDateTime: new Date(end)
						}
					}
				])
			})
			const events = await Events.retrieve({})
			expect(new Date(events[0].StartDateTime)).toEqual(new Date(start))
			expect(new Date(events[0].EndDateTime)).toEqual(new Date(end))
		})
	}
})

it("translates numeric values to `Date` values", async () => {
	const inputs = [
		{
			start: 1531069200000,
			end: 1531072800000,
			expectedStart: "2018-07-08T10:00-07:00",
			expectedEnd: "2018-07-08T11:00-07:00",
			tz: "America/Los_Angeles"
		},
		{
			start: 1531036800000,
			end: 1531040400000,
			expectedStart: "2018-07-08T10:00+02:00",
			expectedEnd: "2018-07-08T11:00+02:00",
			tz: "Europe/Berlin"
		},
		{
			start: 1531044000000,
			end: 1531047600000,
			expectedStart: "2018-07-08T10:00Z",
			expectedEnd: "2018-07-08T11:00Z",
			tz: "UTC"
		}
	]
	expect.assertions(inputs.length * 2)
	const retrieveSpy = jest.spyOn(SObjectMock, "retrieve")
	for (const { start, end, expectedStart, expectedEnd, tz } of inputs) {
		await withTimezone(tz, async () => {
			retrieveSpy.mockImplementationOnce((criteria, cb) => {
				cb(null, [
					{
						_props: {
							StartDateTime: start,
							EndDateTime: end
						}
					}
				])
			})
			const events = await Events.retrieve({})
			expect(new Date(events[0].StartDateTime)).toEqual(new Date(expectedStart))
			expect(new Date(events[0].EndDateTime)).toEqual(new Date(expectedEnd))
		})
	}
})

it("transforms start and end times for all-day events to local time zone", async () => {
	const inputs = [
		{
			expected: "2018-07-08T00:00-07:00",
			tz: "America/Los_Angeles"
		},
		{
			expected: "2018-07-08T00:00+02:00",
			tz: "Europe/Berlin"
		},
		{
			expected: "2018-07-08T00:00Z",
			tz: "UTC"
		}
	]
	expect.assertions(inputs.length * 2)
	const retrieveSpy = jest.spyOn(SObjectMock, "retrieve")
	for (const { expected, tz } of inputs) {
		await withTimezone(tz, async () => {
			const start = new Date("2018-07-08T00:00Z")
			const end = new Date("2018-07-08T00:00Z")
			retrieveSpy.mockImplementationOnce((criteria, cb) => {
				cb(null, [
					{
						_props: {
							IsAllDayEvent: true,
							StartDateTime: start,
							EndDateTime: end
						}
					}
				])
			})
			const events = await Events.retrieve({})
			expect(new Date(events[0].StartDateTime)).toEqual(new Date(expected))
			expect(new Date(events[0].EndDateTime)).toEqual(new Date(expected))
		})
	}
})

it("interprets Salesforce's timezone-less date format as UTC", async () => {
	const inputs = [
		{
			start: "2018-07-08T00:00",
			end: "2018-07-08T00:00",
			expectedStart: "2018-07-08T00:00-07:00",
			expectedEnd: "2018-07-08T00:00-07:00",
			tz: "America/Los_Angeles"
		},
		{
			start: "2018-07-08T00:00",
			end: "2018-07-08T00:00",
			expectedStart: "2018-07-08T00:00+02:00",
			expectedEnd: "2018-07-08T00:00+02:00",
			tz: "Europe/Berlin"
		},
		{
			start: "2018-07-08T00:00",
			end: "2018-07-08T00:00",
			expectedStart: "2018-07-08T00:00Z",
			expectedEnd: "2018-07-08T00:00Z",
			tz: "UTC"
		}
	]
	expect.assertions(inputs.length * 2)
	const retrieveSpy = jest.spyOn(SObjectMock, "retrieve")
	for (const { start, end, expectedStart, expectedEnd, tz } of inputs) {
		await withTimezone(tz, async () => {
			retrieveSpy.mockImplementationOnce((criteria, cb) => {
				cb(null, [
					{
						_props: {
							StartDateTime: start,
							EndDateTime: end,
							IsAllDayEvent: true
						}
					}
				])
			})
			const events = await Events.retrieve({})
			expect(new Date(events[0].StartDateTime)).toEqual(new Date(expectedStart))
			expect(new Date(events[0].EndDateTime)).toEqual(new Date(expectedEnd))
		})
	}
})
