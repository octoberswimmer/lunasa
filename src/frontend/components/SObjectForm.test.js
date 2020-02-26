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
	eventDescription as description,
	eventLayout as layout,
	offsiteEventLayout
} from "../models/Event.testFixtures"
import { delay, inputElement } from "../testHelpers"
import * as ef from "../models/Event.testFixtures"
import Combobox from "./forms/Combobox"
import DateTime from "./forms/DateTime"
import SObjectForm from "./SObjectForm"
import { FIELD_REQUIRED } from "./i18n/errorMessages"
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
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={[
				{ name: "InputA", label: "Input A", type: "string" },
				{ name: "InputB", label: "Input B", type: "string" }
			]}
			layout={layout}
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

it("shows two columns per grid by default", () => {
	const wrapper = mount(
		<SObjectForm
			description={description}
			fieldSet={[
				{ name: "InputA", label: "Input A", type: "string" },
				{ name: "InputB", label: "Input B", type: "string" },
				{ name: "InputC", label: "Input C", type: "string" },
				{ name: "InputD", label: "Input D", type: "string" }
			]}
			layout={layout}
			timezone={timezone}
		/>
	)

	const grids = wrapper.find(".slds-grid")
	//two inputs per grid
	expect(grids.length).toBe(2)
})

it("shows only one column per grid if single column mode is enabled", () => {
	const wrapper = mount(
		<SObjectForm
			singleColumn={true}
			description={description}
			fieldSet={[
				{ name: "InputA", label: "Input A", type: "string" },
				{ name: "InputB", label: "Input B", type: "string" },
				{ name: "InputC", label: "Input C", type: "string" },
				{ name: "InputD", label: "Input D", type: "string" }
			]}
			layout={layout}
			timezone={timezone}
		/>
	)

	const grids = wrapper.find(".slds-grid")
	//one input per grid
	expect(grids.length).toBe(4)
})

it("presents a checkbox input", () => {
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={[
				{
					name: "IsAllDayEvent",
					label: "Is All Day Event",
					required: false,
					type: "boolean"
				}
			]}
			layout={layout}
			timezone={timezone}
		/>
	)
	const input = wrapper.find("input[name='IsAllDayEvent']")
	expect(input.props().type).toBe("checkbox")
	expect(input.props()).toMatchObject({
		required: false,
		type: "checkbox"
	})
})

it("presents a checked checkbox when the corresponding value is `true`", () => {
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={[
				{ name: "IsAllDayEvent", label: "Is All Day Event", type: "boolean" }
			]}
			layout={layout}
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
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={[
				{
					name: "Subject",
					label: "Subject",
					required: true,
					type: "combobox"
				}
			]}
			layout={layout}
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
		],
		required: true
	})
})

it("gets combobox values from the given layout", () => {
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={[
				{
					name: "Subject",
					label: "Subject",
					required: true,
					type: "combobox"
				}
			]}
			layout={offsiteEventLayout}
			timezone={timezone}
		/>
	)
	const input = wrapper.find(Combobox)
	expect(input.props()).toMatchObject({
		name: "Subject",
		label: "Subject",
		// option values from event fixtures
		options: [
			{ active: true, defaultValue: true, label: "Call", value: "Call" },
			{ active: true, defaultValue: false, label: "Email", value: "Email" },
			{
				active: true,
				defaultValue: false,
				label: "Send Letter/Quote",
				value: "Send Letter/Quote"
			}
		],
		required: true
	})
})

it("displays validation error message with combobox input", () => {
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={[]}
			description={description}
			errors={{ Subject: FIELD_REQUIRED }}
			fieldSet={[
				{
					name: "Subject",
					label: "Subject",
					required: true,
					type: "combobox"
				}
			]}
			layout={layout}
			timezone={timezone}
		/>
	)
	const input = wrapper.find(Combobox)
	expect(input).toIncludeText("This field is required")
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
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={[{ name: "ShowAs", label: "Show Time As", type: "picklist" }]}
			layout={layout}
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

it("presents record types as a picklist input", () => {
	// Values from events fixtures
	const values = [
		{ label: "First Event Record Type", value: "012f2000000lw2FAAQ" },
		{ label: "Offsite Events", value: "012f2000000lw2PAAQ" }
	]
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={ef.eventRecordTypeInfos}
			description={description}
			fieldSet={[
				{ name: "RecordTypeId", label: "Record Type Id", type: "reference" }
			]}
			layout={layout}
			timezone={timezone}
		/>
	)
	const input = wrapper.find("select")
	expect(input.closest("label").text()).toMatch("Record Type Id")
	for (const { label, value } of values) {
		const option = input.find(`option[value='${value}']`)
		expect(option.text()).toBe(label)
	}
})

it("gets a boolean value from a checkbox input", async () => {
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={eventCreateFieldSet}
			layout={layout}
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
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={[
				{ name: "Date", label: "Date", required: false, type: "date" }
			]}
			layout={layout}
			timezone={timezone}
		/>
	)
	expect(wrapper.find(DateTime).props()).toMatchObject({
		label: "Date",
		name: "Date",
		showTime: false,
		required: false,
		timezone
	})
})

it("presents a datetime input", () => {
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={[
				{
					name: "StartDateTime",
					label: "Start",
					required: false,
					type: "datetime"
				}
			]}
			layout={layout}
			timezone={timezone}
		/>
	)
	const input = wrapper.find(DateTime)
	expect(wrapper.find(DateTime).props()).toMatchObject({
		label: "Start",
		name: "StartDateTime",
		required: false,
		timezone
	})
	expect(input.props()).not.toHaveProperty("showTime")
})

it("gets a Date value from a datetime input", async () => {
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={eventCreateFieldSet}
			layout={layout}
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
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={[
				{ name: "Description", label: "Description", type: "textarea" }
			]}
			layout={layout}
			timezone={timezone}
		/>
	)
	const input = wrapper.find("textarea")
	expect(input.props().name).toBe("Description")
})

it("gets a string value from a textarea input", async () => {
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={[]}
			description={description}
			fieldSet={eventCreateFieldSet}
			layout={layout}
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

it("displays an asterisk in labels for required fields", () => {
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={[]}
			description={description}
			errors={{ Description: FIELD_REQUIRED }}
			fieldSet={[
				{
					name: "Description",
					label: "Description",
					required: true,
					type: "textarea"
				}
			]}
			layout={layout}
			timezone={timezone}
		/>
	)
	expect(wrapper.find(".slds-form-element__label")).toContainReact(
		<abbr className="slds-required" title="required">
			*
		</abbr>
	)
})

it("displays validation errors with form inputs", () => {
	const wrapper = mount(
		<SObjectForm
			eventRecordTypeInfos={[]}
			description={description}
			errors={{ Description: FIELD_REQUIRED }}
			fieldSet={[
				{ name: "Description", label: "Description", type: "textarea" }
			]}
			layout={layout}
			timezone={timezone}
		/>
	)
	expect(wrapper).toIncludeText("This field is required")
	expect(wrapper.find(".slds-form-element")).toHaveClassName("slds-has-error")
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
