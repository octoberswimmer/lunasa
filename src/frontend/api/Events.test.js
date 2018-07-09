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
