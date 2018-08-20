/* @flow strict */

import Datepicker from "@salesforce/design-system-react/components/date-picker"
import Timepicker from "@salesforce/design-system-react/components/time-picker"
import * as enzyme from "enzyme"
import { Form, Formik } from "formik"
import moment from "moment-timezone"
import * as React from "react"
import * as clf from "../../models/CustomLabel.testFixtures"
import {
	delay,
	inputElement,
	withLocaleAndTz,
	withTimezone
} from "../../testHelpers"
import { sameMoment } from "../../test/customExpect"
import { setTimezone } from "../../util/moment"
import { LabelProvider } from "../i18n/Label"
import DateTime from "./DateTime"

const onSubmit = jest.fn()
const timezone = moment.tz.guess()

afterEach(() => {
	onSubmit.mockClear()
})

it("preserves initial value if no changes have been made", async () => {
	const start = new Date("2018-06-29T10:00-07:00")
	const inputs = [
		{ tz: "Europe/Berlin" },
		{ tz: "America/Los_Angeles" },
		{ tz: "UTC" }
	]
	expect.assertions(inputs.length)
	for (const { tz } of inputs) {
		await withTimezone(tz, async () => {
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={tz} />,
				{
					initialValues: { start }
				}
			)
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({ start }),
				expect.anything()
			)
		})
	}
})

it("displays date according to locale", async () => {
	const inputs = [
		{ locale: "de", value: "05.07.2018", tz: "Europe/Berlin" },
		{ locale: "en", value: "07/05/2018", tz: "America/Los_Angeles" },
		{ locale: "es", value: "05/07/2018", tz: "UTC" }
	]
	expect.assertions(inputs.length)
	for (const { locale, value, tz } of inputs) {
		await withLocaleAndTz(locale, tz, async () => {
			const start = moment.tz("2018-07-05", tz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={tz} />,
				{
					initialValues: { start }
				}
			)
			const input = wrapper.find(Datepicker).find("input")
			expect(input.prop("value")).toBe(value)
		})
	}
})

it("displays date in the user's chosen timezone", async () => {
	const inputs = [
		{
			locale: "ja",
			value: "2018/07/05",
			userTz: "Asia/Tokyo",
			browserTz: "America/Los_Angeles"
		},
		{
			locale: "en",
			value: "07/05/2018",
			userTz: "America/Los_Angeles",
			browserTz: "Asia/Tokyo"
		}
	]
	expect.assertions(inputs.length)
	for (const { locale, value, userTz, browserTz } of inputs) {
		await withLocaleAndTz(locale, browserTz, async () => {
			const start = moment.tz("2018-07-05", userTz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={userTz} />,
				{
					initialValues: { start }
				}
			)
			const input = wrapper.find(Datepicker).find("input")
			expect(input.prop("value")).toBe(value)
		})
	}
})

it("captures change to date input via text entry", async () => {
	const inputs = [
		{ locale: "de", value: "05.07.2018", tz: "Europe/Berlin" },
		{ locale: "en", value: "07/05/2018", tz: "America/Los_Angeles" },
		{ locale: "es", value: "05/07/2018", tz: "UTC" }
	]
	expect.assertions(inputs.length * 2)
	for (const { locale, value, tz } of inputs) {
		await withLocaleAndTz(locale, tz, async () => {
			const start = moment.tz("2018-06-29", tz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={tz} />,
				{
					initialValues: { start }
				}
			)
			const input = wrapper.find(Datepicker).find("input")
			inputElement(input).value = value
			input.simulate("change")
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledTimes(1)
			const result = onSubmit.mock.calls[0][0].start
			expect(setTimezone(tz, result).format("YYYY-MM-DD")).toMatch("2018-07-05")
			onSubmit.mockClear()
		})
	}
})

it("captures change to date input via calendar dropdown", async () => {
	const inputs = [
		{ locale: "de", value: "05.07.2018", tz: "Europe/Berlin" },
		{ locale: "en", value: "07/05/2018", tz: "America/Los_Angeles" },
		{ locale: "es", value: "05/07/2018", tz: "UTC" }
	]
	expect.assertions(inputs.length * 2)
	for (const { locale, value, tz } of inputs) {
		await withLocaleAndTz(locale, tz, async () => {
			const start = moment.tz("2018-06-29", tz).toDate()
			const newDate = moment.tz("2018-07-05", tz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={tz} />,
				{
					initialValues: { start }
				}
			)
			const datePicker = wrapper.find(Datepicker)
			datePicker.prop("onChange")({}, { date: newDate })
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledTimes(1)
			const result = onSubmit.mock.calls[0][0].start
			expect(setTimezone(tz, result).format("YYYY-MM-DD")).toMatch("2018-07-05")
			onSubmit.mockClear()
		})
	}
})

it("captures date via text entry in the user's chosen timezone", async () => {
	const inputs = [
		{
			locale: "ja",
			value: "2018/07/05",
			userTz: "Asia/Tokyo",
			browserTz: "America/Los_Angeles"
		},
		{
			locale: "en",
			value: "07/05/2018",
			userTz: "America/Los_Angeles",
			browserTz: "Asia/Tokyo"
		}
	]
	expect.assertions(inputs.length * 2)
	for (const { locale, value, userTz, browserTz } of inputs) {
		await withLocaleAndTz(locale, browserTz, async () => {
			const start = moment.tz("2018-06-29", userTz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={userTz} />,
				{
					initialValues: { start }
				}
			)
			const input = wrapper.find(Datepicker).find("input")
			inputElement(input).value = value
			input.simulate("change")
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledTimes(1)
			const result = onSubmit.mock.calls[0][0].start
			expect(setTimezone(userTz, result).format("YYYY-MM-DD")).toMatch(
				"2018-07-05"
			)
			onSubmit.mockClear()
		})
	}
})

it("updates date but not time when date input changes", async () => {
	const inputs = [
		{ locale: "de", value: "05.07.2018", tz: "Europe/Berlin" },
		{ locale: "en", value: "07/05/2018", tz: "America/Los_Angeles" },
		{ locale: "es", value: "05/07/2018", tz: "UTC" }
	]
	expect.assertions(inputs.length)
	for (const { locale, value, tz } of inputs) {
		await withLocaleAndTz(locale, tz, async () => {
			const start = moment.tz("2018-06-29T10:00", tz).toDate()
			const expected = moment.tz("2018-07-05T10:00", tz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={tz} />,
				{
					initialValues: { start }
				}
			)
			const input = wrapper.find(Datepicker).find("input")
			inputElement(input).value = value
			input.simulate("change")
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({ start: expected }),
				expect.anything()
			)
		})
	}
})

it("displays time according to locale", async () => {
	const inputs = [
		{ locale: "de", value: "14:10", tz: "Europe/Berlin" },
		{ locale: "en", value: "2:10 PM", tz: "America/Los_Angeles" },
		{ locale: "es", value: "14:10", tz: "UTC" }
	]
	expect.assertions(inputs.length)
	for (const { locale, value, tz } of inputs) {
		await withLocaleAndTz(locale, tz, async () => {
			const start = moment.tz("2018-06-29T14:10", tz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={tz} />,
				{
					initialValues: { start }
				}
			)
			const input = wrapper.find(Timepicker).find("input")
			expect(input.prop("value")).toBe(value)
		})
	}
})

it("displays time in the user's chosen timezone", async () => {
	const inputs = [
		{
			locale: "de",
			value: "14:10",
			userTz: "Europe/Berlin",
			browserTz: "America/Los_Angeles"
		},
		{
			locale: "en",
			value: "2:10 PM",
			userTz: "America/Los_Angeles",
			browserTz: "UTC"
		},
		{ locale: "es", value: "14:10", userTz: "UTC", browserTz: "Europe/Berlin" }
	]
	expect.assertions(inputs.length)
	for (const { locale, value, userTz, browserTz } of inputs) {
		await withLocaleAndTz(locale, browserTz, async () => {
			const start = moment.tz("2018-06-29T14:10", userTz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={userTz} />,
				{
					initialValues: { start }
				}
			)
			const input = wrapper.find(Timepicker).find("input")
			expect(input.prop("value")).toBe(value)
		})
	}
})

it("provides time options in dropdown appropriate for user's chosen timezone", async () => {
	const inputs = [
		{
			locale: "de",
			expected: [
				"00:00",
				"00:30",
				"01:00",
				"01:30",
				"02:00",
				"02:30",
				"03:00",
				"03:30",
				"04:00",
				"04:30",
				"05:00",
				"05:30",
				"06:00",
				"06:30",
				"07:00",
				"07:30",
				"08:00",
				"08:30",
				"09:00",
				"09:30",
				"10:00",
				"10:30",
				"11:00",
				"11:30",
				"12:00",
				"12:30",
				"13:00",
				"13:30",
				"14:00",
				"14:30",
				"15:00",
				"15:30",
				"16:00",
				"16:30",
				"17:00",
				"17:30",
				"18:00",
				"18:30",
				"19:00",
				"19:30",
				"20:00",
				"20:30",
				"21:00",
				"21:30",
				"22:00",
				"22:30",
				"23:00",
				"23:30"
			],
			userTz: "Europe/Berlin",
			browserTz: "America/Los_Angeles"
		},
		{
			locale: "en",
			expected: [
				"12:00 AM",
				"12:30 AM",
				"1:00 AM",
				"1:30 AM",
				"2:00 AM",
				"2:30 AM",
				"3:00 AM",
				"3:30 AM",
				"4:00 AM",
				"4:30 AM",
				"5:00 AM",
				"5:30 AM",
				"6:00 AM",
				"6:30 AM",
				"7:00 AM",
				"7:30 AM",
				"8:00 AM",
				"8:30 AM",
				"9:00 AM",
				"9:30 AM",
				"10:00 AM",
				"10:30 AM",
				"11:00 AM",
				"11:30 AM",
				"12:00 PM",
				"12:30 PM",
				"1:00 PM",
				"1:30 PM",
				"2:00 PM",
				"2:30 PM",
				"3:00 PM",
				"3:30 PM",
				"4:00 PM",
				"4:30 PM",
				"5:00 PM",
				"5:30 PM",
				"6:00 PM",
				"6:30 PM",
				"7:00 PM",
				"7:30 PM",
				"8:00 PM",
				"8:30 PM",
				"9:00 PM",
				"9:30 PM",
				"10:00 PM",
				"10:30 PM",
				"11:00 PM",
				"11:30 PM"
			],
			userTz: "America/Los_Angeles",
			browserTz: "UTC"
		}
	]
	for (const { locale, expected, userTz, browserTz } of inputs) {
		await withLocaleAndTz(locale, browserTz, async () => {
			const start = moment.tz("2018-06-29T10:00", userTz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={userTz} />,
				{
					initialValues: { start }
				}
			)
			wrapper
				.find(Timepicker)
				.find("input")
				.simulate("click")
			wrapper.update()
			const options = wrapper.find(Timepicker).find("a[role='menuitem']")
			expect(options.map(o => o.text())).toEqual(expected)
		})
	}
})

it("captures change to time input", async () => {
	const inputs = [
		{ locale: "de", value: "14:10", tz: "Europe/Berlin" },
		{ locale: "en", value: "2:10 PM", tz: "America/Los_Angeles" },
		{ locale: "es", value: "14:10", tz: "UTC" }
	]
	expect.assertions(inputs.length * 2)
	for (const { locale, value, tz } of inputs) {
		await withLocaleAndTz(locale, tz, async () => {
			const start = moment.tz("2018-06-29T10:00", tz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={tz} />,
				{
					initialValues: { start }
				}
			)
			const input = wrapper.find(Timepicker).find("input")
			inputElement(input).value = value
			input.simulate("change")
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledTimes(1)
			const result = onSubmit.mock.calls[0][0].start
			expect(setTimezone(tz, result).format("HH:mm")).toMatch("14:10")
			onSubmit.mockClear()
		})
	}
})

it("captures change to time input when user's timezone does not match browser's timezone", async () => {
	const inputs = [
		{
			locale: "de",
			value: "14:10",
			userTz: "Europe/Berlin",
			browserTz: "America/Los_Angeles"
		},
		{
			locale: "en",
			value: "2:10 PM",
			userTz: "America/Los_Angeles",
			browserTz: "UTC"
		},
		{ locale: "es", value: "14:10", userTz: "UTC", browserTz: "UTC" }
	]
	expect.assertions(inputs.length * 2)
	for (const { locale, value, userTz, browserTz } of inputs) {
		await withLocaleAndTz(locale, browserTz, async () => {
			const start = moment.tz("2018-06-29T10:00", userTz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={userTz} />,
				{
					initialValues: { start }
				}
			)
			const input = wrapper.find(Timepicker).find("input")
			inputElement(input).value = value
			input.simulate("change")
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledTimes(1)
			const result = onSubmit.mock.calls[0][0].start
			expect(setTimezone(userTz, result).format("HH:mm")).toMatch("14:10")
			onSubmit.mockClear()
		})
	}
})

it("updates time but not date when time input changes", async () => {
	const inputs = [
		{ locale: "de", value: "14:10", tz: "Europe/Berlin" },
		{ locale: "en", value: "2:10 PM", tz: "America/Los_Angeles" },
		{ locale: "es", value: "14:10", tz: "UTC" }
	]
	expect.assertions(inputs.length)
	for (const { locale, value, tz } of inputs) {
		await withLocaleAndTz(locale, tz, async () => {
			const start = moment.tz("2018-06-29T10:00", tz).toDate()
			const expected = moment.tz("2018-06-29T14:10", tz).toDate()
			const wrapper = mount(
				<DateTime label="Start" name="start" timezone={tz} />,
				{
					initialValues: { start }
				}
			)
			const input = wrapper.find(Timepicker).find("input")
			inputElement(input).value = value
			input.simulate("change")
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({ start: expected }),
				expect.anything()
			)
			onSubmit.mockClear()
		})
	}
})

it("displays an error on invalid date entry", () => {
	const start = new Date("2018-06-29T10:00")
	const wrapper = mount(
		<DateTime label="Start" name="start" timezone={moment.tz.guess()} />,
		{
			initialValues: { start }
		}
	)
	const input = wrapper.find(Datepicker).find("input")
	inputElement(input).value = "not a date"
	input.simulate("change")
	expect(wrapper.text()).toMatch("Invalid date")
})

it("clears an invalid date error when a valid date is entered", () => {
	const start = new Date("2018-06-29T10:00")
	const wrapper = mount(
		<DateTime label="Start" name="start" timezone={moment.tz.guess()} />,
		{
			initialValues: { start }
		}
	)
	const input = wrapper.find(Datepicker).find("input")
	inputElement(input).value = "not a time"
	input.simulate("change")
	inputElement(input).value = moment("2018-06-29").format("L")
	input.simulate("change")
	expect(wrapper.text()).not.toMatch("Invalid date")
})

it("displays an error on invalid time entry", () => {
	const start = new Date("2018-06-29T10:00")
	const wrapper = mount(
		<DateTime label="Start" name="start" timezone={moment.tz.guess()} />,
		{
			initialValues: { start }
		}
	)
	const input = wrapper.find(Timepicker).find("input")
	inputElement(input).value = "not a time"
	input.simulate("change")
	expect(wrapper.text()).toMatch("Invalid time")
})

it("clears an invalid time error when a valid time is entered", () => {
	const start = new Date("2018-06-29T10:00")
	const wrapper = mount(
		<DateTime label="Start" name="start" timezone={moment.tz.guess()} />,
		{
			initialValues: { start }
		}
	)
	const input = wrapper.find(Timepicker).find("input")
	inputElement(input).value = "not a time"
	input.simulate("change")
	inputElement(input).value = moment("14:10", "HH:mm").format("LT")
	input.simulate("change")
	expect(wrapper.text()).not.toMatch("Invalid time")
})

function mount(
	component: React.Node,
	formikProps: Object = {}
): enzyme.ReactWrapper {
	return enzyme.mount(
		<Formik
			{...formikProps}
			onSubmit={onSubmit}
			render={() => (
				<LabelProvider value={clf.labels}>
					<Form>{component}</Form>
				</LabelProvider>
			)}
		/>
	)
}

async function submit(wrapper: enzyme.ReactWrapper) {
	const form = wrapper.find("form")
	form.props().onSubmit()
	await delay()
}
