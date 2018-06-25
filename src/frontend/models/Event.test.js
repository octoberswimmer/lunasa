/* @flow strict */

import moment from "moment"
import { newEvent } from "./Event"
import * as ef from "./Event.testFixtures"

const account = {
	attributes: { type: "test", url: "test:///" },
	CreatedDate: "2018-06-01T20:35:50.000+0000",
	Name: "Test Account",
	Phone: "(520) 773-9050",
	Site: null
}

it("creates a new event draft from an account and a date", () => {
	const date = moment()
	const event = newEvent({ account, date })
	expect(event.Subject).toBe("Meeting with Test Account")
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
