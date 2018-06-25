/* @flow strict */

import moment from "moment"
import resetDateCache from "reset-date-cache"
import EventModel from "../api/Events"
import { visualforceDatetime } from "../models/Event"
import { delay } from "../testHelpers"
import Events from "./Events"

const retrieveSpy = jest.spyOn(EventModel, "retrieve")

afterEach(() => {
	jest.resetAllMocks()
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
