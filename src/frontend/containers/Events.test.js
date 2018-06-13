/* @flow strict */

import moment from "moment"
import EventModel from "../api/Events"
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
				StartDateTime: { lt: today.endOf("day").toDate() },
				EndDateTime: { gt: today.startOf("day").toDate() }
			}
		}
	})
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
				StartDateTime: { lt: today.endOf("day").toDate() },
				EndDateTime: { gt: today.startOf("day").toDate() }
			}
		}
	})
})

it("reports errors from asynchronous actions", async () => {
	retrieveSpy.mockImplementation(async () => {
		throw new Error("an error occurred")
	})
	const events = new Events(EventModel)
	const today = moment()
	await events.getEventsByDateRange(today, today)
	expect(events.state.errors).toHaveLength(1)
	expect(events.state.errors[0].message).toBe("an error occurred")
})

it("indicates that a request is in progress", async () => {
	expect.assertions(3)
	const events = new Events(EventModel)
	expect(events.isLoading()).toBe(false)
	const promise = events._asyncAction(() => delay(5))
	await delay(0)
	expect(events.isLoading()).toBe(true)
	await delay(10)
	expect(events.isLoading()).toBe(false)
	await promise // make sure to wait until `_asyncAction()` has finished
})

it("resets loading state when an error occurs", async () => {
	expect.assertions(1)
	const events = new Events(EventModel)
	await events._asyncAction(async () => {
		throw new Error("an error occurred")
	})
	expect(events.isLoading()).toBe(false)
})
