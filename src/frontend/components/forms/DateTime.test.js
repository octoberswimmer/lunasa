/* @flow strict */

import Datepicker from "@salesforce/design-system-react/components/date-picker"
import Timepicker from "@salesforce/design-system-react/components/time-picker"
import * as enzyme from "enzyme"
import { Form, Formik } from "formik"
import moment from "moment"
import * as React from "react"
import * as clf from "../../models/CustomLabel.testFixtures"
import {
	delay,
	inputElement,
	parseLocalDate,
	withLocaleAndTz,
	withTimezone
} from "../../testHelpers"
import { LabelProvider } from "../i18n/Label"
import DateTime from "./DateTime"

const onSubmit = jest.fn()

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
			const wrapper = mount(<DateTime label="Start" name="start" />, {
				initialValues: { start }
			})
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
			const start = parseLocalDate("2018-07-05")
			const wrapper = mount(<DateTime label="Start" name="start" />, {
				initialValues: { start }
			})
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
			const start = parseLocalDate("2018-06-29")
			const wrapper = mount(<DateTime label="Start" name="start" />, {
				initialValues: { start }
			})
			const input = wrapper.find(Datepicker).find("input")
			inputElement(input).value = value
			input.simulate("change")
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledTimes(1)
			const result = onSubmit.mock.calls[0][0].start
			expect(
				moment(result)
					.local()
					.format("YYYY-MM-DD")
			).toMatch("2018-07-05")
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
			const start = parseLocalDate("2018-06-29")
			const newDate = parseLocalDate("2018-07-05")
			const wrapper = mount(<DateTime label="Start" name="start" />, {
				initialValues: { start }
			})
			const datePicker = wrapper.find(Datepicker)
			datePicker.prop("onChange")({}, { date: newDate })
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledTimes(1)
			const result = onSubmit.mock.calls[0][0].start
			expect(
				moment(result)
					.local()
					.format("YYYY-MM-DD")
			).toMatch("2018-07-05")
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
			const start = parseLocalDate("2018-06-29T10:00")
			const expected = parseLocalDate("2018-07-05T10:00")
			const wrapper = mount(<DateTime label="Start" name="start" />, {
				initialValues: { start }
			})
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
			const start = parseLocalDate("2018-06-29T14:10")
			const wrapper = mount(<DateTime label="Start" name="start" />, {
				initialValues: { start }
			})
			const input = wrapper.find(Timepicker).find("input")
			expect(input.prop("value")).toBe(value)
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
			const start = parseLocalDate("2018-06-29T10:00")
			const wrapper = mount(<DateTime label="Start" name="start" />, {
				initialValues: { start }
			})
			const input = wrapper.find(Timepicker).find("input")
			inputElement(input).value = value
			input.simulate("change")
			await submit(wrapper)
			expect(onSubmit).toHaveBeenCalledTimes(1)
			const result = onSubmit.mock.calls[0][0].start
			expect(
				moment(result)
					.local()
					.format("HH:mm")
			).toMatch("14:10")
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
			const start = parseLocalDate("2018-06-29T10:00")
			const expected = parseLocalDate("2018-06-29T14:10")
			const wrapper = mount(<DateTime label="Start" name="start" />, {
				initialValues: { start }
			})
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
	const wrapper = mount(<DateTime label="Start" name="start" />, {
		initialValues: { start }
	})
	const input = wrapper.find(Datepicker).find("input")
	inputElement(input).value = "not a date"
	input.simulate("change")
	expect(wrapper.text()).toMatch("Invalid date")
})

it("clears an invalid date error when a valid date is entered", () => {
	const start = new Date("2018-06-29T10:00")
	const wrapper = mount(<DateTime label="Start" name="start" />, {
		initialValues: { start }
	})
	const input = wrapper.find(Datepicker).find("input")
	inputElement(input).value = "not a time"
	input.simulate("change")
	inputElement(input).value = moment("2018-06-29").format("L")
	input.simulate("change")
	expect(wrapper.text()).not.toMatch("Invalid date")
})

it("displays an error on invalid time entry", () => {
	const start = new Date("2018-06-29T10:00")
	const wrapper = mount(<DateTime label="Start" name="start" />, {
		initialValues: { start }
	})
	const input = wrapper.find(Timepicker).find("input")
	inputElement(input).value = "not a time"
	input.simulate("change")
	expect(wrapper.text()).toMatch("Invalid time")
})

it("clears an invalid time error when a valid time is entered", () => {
	const start = new Date("2018-06-29T10:00")
	const wrapper = mount(<DateTime label="Start" name="start" />, {
		initialValues: { start }
	})
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
