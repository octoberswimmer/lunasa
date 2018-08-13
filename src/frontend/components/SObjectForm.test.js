/* @flow strict */

import Datepicker from "@salesforce/design-system-react/components/date-picker"
import Timepicker from "@salesforce/design-system-react/components/time-picker"
import * as enzyme from "enzyme"
import { Formik } from "formik"
import moment from "moment-timezone"
import * as React from "react"
import * as clf from "../models/CustomLabel.testFixtures"
import { type Event } from "../models/Event"
import {
	eventCreateFieldSet,
	eventDescription as description
} from "../models/Event.testFixtures"
import { delay, inputElement } from "../testHelpers"
import Combobox from "./forms/Combobox"
import DateTime from "./forms/DateTime"
import SObjectForm from "./SObjectForm"
import { LabelProvider } from "./i18n/Label"

const draft = {
	Subject: "Meeting with Account",
	StartDateTime: new Date("2018-06-29T17:00Z"),
	EndDateTime: new Date("2018-06-29T18:00Z"),
	IsAllDayEvent: false
}

const onSubmit = jest.fn()
const timezone = moment.tz.guess()

afterEach(() => {
	onSubmit.mockClear()
})

it("presents inputs based on a given field set", () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={[
				{ name: "InputA", label: "Input A", type: "string" },
				{ name: "InputB", label: "Input B", type: "string" }
			]}
			timezone={timezone}
		/>
	)
	const inputA = wrapper.find("input[name='InputA']")
	expect(inputA.props().type).toBe("text")
	expect(inputA.closest("label").text()).toBe("Input A")

	const inputB = wrapper.find("input[name='InputB']")
	expect(inputB.props().type).toBe("text")
	expect(inputB.closest("label").text()).toBe("Input B")
})

it("presents a checkbox input", () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={[
				{ name: "IsAllDayEvent", label: "Is All Day Event", type: "boolean" }
			]}
			timezone={timezone}
		/>
	)
	const input = wrapper.find("input[name='IsAllDayEvent']")
	expect(input.props().type).toBe("checkbox")
})

it("presents a checked checkbox when the corresponding value is `true`", () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={[
				{ name: "IsAllDayEvent", label: "Is All Day Event", type: "boolean" }
			]}
			timezone={timezone}
		/>,
		{ IsAllDayEvent: true }
	)
	const input = wrapper.find("input[name='IsAllDayEvent']")
	expect(input.props()).toHaveProperty("checked", true)
})

it("presents a combobox input", () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={[{ name: "Subject", label: "Subject", type: "combobox" }]}
			timezone={timezone}
		/>
	)
	const input = wrapper.find(Combobox)
	expect(input.props()).toMatchObject({
		name: "Subject",
		label: "Subject",
		// option values from event fixtures
		options: [
			{ active: true, defaultValue: false, label: "Call", value: "Call" },
			{ active: true, defaultValue: false, label: "Email", value: "Email" },
			{
				active: true,
				defaultValue: true,
				label: "Meeting",
				value: "Meeting"
			},
			{
				active: true,
				defaultValue: false,
				label: "Send Letter/Quote",
				value: "Send Letter/Quote"
			},
			{ active: true, defaultValue: false, label: "Other", value: "Other" }
		]
	})
})

it("presents a picklist input", () => {
	expect.assertions(4)
	// Values from events fixtures
	const values = [
		{ label: "Busy", value: "Busy" },
		{ label: "Out of Office", value: "OutOfOffice" },
		{ label: "Free", value: "Free" }
	]
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={[{ name: "ShowAs", label: "Show Time As", type: "picklist" }]}
			timezone={timezone}
		/>
	)
	const input = wrapper.find("select")
	expect(input.closest("label").text()).toMatch("Show Time As")
	for (const { label, value } of values) {
		const option = input.find(`option[value='${value}']`)
		expect(option.text()).toBe(label)
	}
})

it("gets a boolean value from a checkbox input", async () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={eventCreateFieldSet}
			timezone={timezone}
		/>,
		draft
	)
	const input = wrapper.find("input[name='IsAllDayEvent']")
	;(input.getDOMNode(): any).checked = true
	input.simulate("change")
	await submit(wrapper)
	expect(onSubmit).toHaveBeenCalledWith(
		expect.objectContaining({ IsAllDayEvent: true }),
		expect.anything()
	)
})

it("presents a date input", () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={[{ name: "Date", label: "Date", type: "date" }]}
			timezone={timezone}
		/>
	)
	const input = wrapper.find(DateTime)
	expect(input.props()).toHaveProperty("label", "Date")
	expect(input.props()).toHaveProperty("name", "Date")
	expect(input.props()).toHaveProperty("showTime", false)
})

it("presents a datetime input", () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={[{ name: "StartDateTime", label: "Start", type: "datetime" }]}
			timezone={timezone}
		/>
	)
	const input = wrapper.find(DateTime)
	expect(input.props()).toHaveProperty("label", "Start")
	expect(input.props()).toHaveProperty("name", "StartDateTime")
	expect(input.props()).not.toHaveProperty("showTime")
})

it("gets a Date value from a datetime input", async () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={eventCreateFieldSet}
			timezone={timezone}
		/>,
		draft
	)
	const dateTime = wrapper.find(DateTime).filter("[name='StartDateTime']")
	const dateInput = dateTime.find(Datepicker).find("input")
	inputElement(dateInput).value = moment("2018-07-15T10:00-07:00").format("L")
	dateInput.simulate("change")
	const timeInput = dateTime.find(Timepicker).find("input")
	inputElement(timeInput).value = moment("2018-07-15T10:00-07:00").format("LT")
	timeInput.simulate("change")
	await submit(wrapper)
	expect(onSubmit).toHaveBeenCalledWith(
		expect.objectContaining({
			StartDateTime: new Date("2018-07-15T10:00-07:00")
		}),
		expect.anything()
	)
})

it("presents a textarea input", () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={[
				{ name: "Description", label: "Description", type: "textarea" }
			]}
			timezone={timezone}
		/>
	)
	const input = wrapper.find("textarea")
	expect(input.props().name).toBe("Description")
})

it("gets a string value from a textarea input", async () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={eventCreateFieldSet}
			timezone={timezone}
		/>
	)
	const input = wrapper.find("textarea")
	inputElement(input).value = "some description"
	input.simulate("change")
	await submit(wrapper)
	expect(onSubmit).toHaveBeenCalledWith(
		expect.objectContaining({
			Description: "some description"
		}),
		expect.anything()
	)
})

function mount(
	component: React.Node,
	initialValues: $Shape<Event> = {}
): enzyme.ReactWrapper {
	return enzyme.mount(
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			render={() => (
				<LabelProvider value={clf.labels}>{component}</LabelProvider>
			)}
		/>
	)
}

async function submit(wrapper: enzyme.ReactWrapper) {
	const form = wrapper.find("form")
	form.props().onSubmit()
	await delay()
}
