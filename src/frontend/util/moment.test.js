/* @flow strict */

import moment from "moment-timezone"
import { withTimezone } from "../testHelpers"
import { sameMoment } from "../test/customExpect"
import {
	disambiguateTimezone,
	mergeDateAndTime,
	hasTimezone,
	setTimezone,
	stripZone
} from "./moment"

it("removes timezone information from a Moment value", async () => {
	const inputs = [
		{
			tz: "America/Los_Angeles",
			t: "2018-07-08T10:00-07:00",
			expected: "2018-07-08T10:00Z"
		},
		{
			tz: "Europe/Berlin",
			t: "2018-07-08T10:00+02:00",
			expected: "2018-07-08T10:00Z"
		},
		{ tz: "UTC", t: "2018-07-08T10:00Z", expected: "2018-07-08T10:00Z" }
	]
	expect.assertions(inputs.length * 3)
	for (const { tz, t, expected } of inputs) {
		await withTimezone(tz, async () => {
			const input = moment(t)
			const output = stripZone(input)
			expect(hasTimezone(input)).toBe(true)
			expect(hasTimezone(output)).toBe(false)
			expect(output.toDate()).toEqual(new Date(expected))
		})
	}
})

it("produces the same result after repeatedly stripping time zone information", async () => {
	const inputs = [
		{
			tz: "America/Los_Angeles",
			t: "2018-07-08T10:00-07:00",
			expected: "2018-07-08T10:00Z"
		},
		{
			tz: "Europe/Berlin",
			t: "2018-07-08T10:00+02:00",
			expected: "2018-07-08T10:00Z"
		},
		{ tz: "UTC", t: "2018-07-08T10:00Z", expected: "2018-07-08T10:00Z" }
	]
	expect.assertions(inputs.length)
	for (const { tz, t, expected } of inputs) {
		await withTimezone(tz, async () => {
			const input = moment(t)
			const output = stripZone(stripZone(input))
			expect(output.toDate()).toEqual(new Date(expected))
		})
	}
})

it("disambiguates an ambiguous Moment value", async () => {
	const inputs = [
		{ tz: "America/Los_Angeles", t: "2018-07-08T10:00-07:00" },
		{ tz: "Europe/Berlin", t: "2018-07-08T10:00+02:00" },
		{ tz: "UTC", t: "2018-07-08T10:00Z" }
	]
	expect.assertions(inputs.length)
	for (const { tz, t } of inputs) {
		await withTimezone(tz, async () => {
			const input = moment(t)
			const stripped = stripZone(input)
			const disambiguated = disambiguateTimezone(tz, stripped)
			expect(disambiguated.toDate()).toEqual(new Date(t))
		})
	}
})

it("disambiguating an unambiguous Moment value is a noop", async () => {
	const inputs = [
		{ tz: "America/Los_Angeles", t: "2018-07-08T10:00-07:00" },
		{ tz: "Europe/Berlin", t: "2018-07-08T10:00+02:00" },
		{ tz: "UTC", t: "2018-07-08T10:00Z" }
	]
	expect.assertions(inputs.length)
	for (const { tz, t } of inputs) {
		await withTimezone(tz, async () => {
			const input = moment(t)
			const disambiguated = disambiguateTimezone(tz, input)
			expect(disambiguated.toDate()).toEqual(new Date(t))
		})
	}
})

it("changes the timezone of a Moment value", async () => {
	const inputs = [
		{
			fromTz: "America/Los_Angeles",
			toTz: "Europe/Berlin",
			t: "2018-07-08T10:00-07:00",
			expected: "2018-07-08T19:00+02:00"
		},
		{
			fromTz: "Europe/Berlin",
			toTz: "America/Los_Angeles",
			t: "2018-07-08T10:00+02:00",
			expected: "2018-07-08T01:00-07:00"
		},
		{
			fromTz: "Europe/Berlin",
			toTz: "UTC",
			t: "2018-07-08T10:00+02:00",
			expected: "2018-07-08T08:00Z"
		},
		{
			fromTz: "UTC",
			toTz: "Europe/Berlin",
			t: "2018-07-08T10:00Z",
			expected: "2018-07-08T12:00+02:00"
		}
	]
	expect.assertions(inputs.length)
	for (const { fromTz, toTz, t, expected } of inputs) {
		await withTimezone(toTz, async () => {
			const input = moment(t)
			const output = setTimezone(toTz, input)
			expect(output.toDate()).toEqual(new Date(expected))
		})
	}
})

it("merges the date of one Moment value with the time-of-day of another", () => {
	const inputs = [
		{
			date: "2018-08-19T00:00-07:00",
			time: "2018-01-01T10:30-07:00",
			expected: "2018-08-19T10:30-07:00"
		},
		{
			date: "2018-08-19T00:00+02:00",
			time: "2018-08-19T10:30+02:00",
			expected: "2018-08-19T10:30+02:00"
		},
		{
			date: "2018-08-19T10:30Z",
			time: "2018-08-19T10:30Z",
			expected: "2018-08-19T10:30Z"
		}
	]
	for (const { date, time, expected } of inputs) {
		const result = mergeDateAndTime({
			date: moment.parseZone(date),
			time: moment.parseZone(time)
		})
		expect(result).toEqual(sameMoment(expected))
	}
})

it("reports an error when attempting to merge date and time from different timezones", () => {
	const date = moment.tz("2018-08-19T00:00", "America/Los_Angeles")
	const time = moment.tz("2018-01-01T10:30", "Europe/Berlin")
	expect(() => {
		mergeDateAndTime({ date, time })
	}).toThrowError("Date and time to be merged must have the same time zone.")
})
