/* @flow strict */

import * as enzyme from "enzyme"
import moment from "moment"
import * as React from "react"
import ReactDateTime from "react-datetime"
import { Provider } from "unstated"
import Events from "../containers/Events"
import { eventCreateFieldSet } from "../models/Event.testFixtures"
import { delay } from "../testHelpers"
import CreateEvent from "./CreateEvent"
import DateTime from "./forms/DateTime"

const draft = {
	Subject: "Meeting with Account",
	StartDateTime: new Date("2018-06-29T17:00Z"),
	EndDateTime: new Date("2018-06-29T18:00Z"),
	IsAllDayEvent: false
}

const eventsOpts = { eventCreateFieldSet }

it("requests event object description on mount", async () => {
	const events = new Events(eventsOpts)
	jest.spyOn(events, "fetchEventDescription")
	const wrapper = mount(<CreateEvent />, events)
	expect(events.fetchEventDescription).toHaveBeenCalled()
})

it("creates an event", async () => {
	const events = new Events(eventsOpts)
	await events.newEvent(draft)
	const wrapper = mount(<CreateEvent />, events)
	await submit(wrapper)
	expect(events.state.events).toContainEqual(
		expect.objectContaining({ Subject: "Meeting with Account" })
	)
})

it("presents inputs based on a given field set", async () => {
	const events = new Events({
		eventCreateFieldSet: [
			{ name: "InputA", label: "Input A", type: "string" },
			{ name: "InputB", label: "Input B", type: "string" }
		]
	})
	const wrapper = mount(<CreateEvent />, events)

	const inputA = wrapper.find("input[name='InputA']")
	expect(inputA.props().type).toBe("text")
	expect(inputA.closest("label").text()).toBe("Input A: ")

	const inputB = wrapper.find("input[name='InputB']")
	expect(inputB.props().type).toBe("text")
	expect(inputB.closest("label").text()).toBe("Input B: ")
})

it("presents a checkbox input", async () => {
	const events = new Events({
		eventCreateFieldSet: [
			{ name: "IsAllDayEvent", label: "Is All Day Event", type: "boolean" }
		]
	})
	const wrapper = mount(<CreateEvent />, events)
	const input = wrapper.find("input[name='IsAllDayEvent']")
	expect(input.props().type).toBe("checkbox")
})

it("gets a boolean value from a checkbox input", async () => {
	const events = new Events(eventsOpts)
	await events.newEvent(draft)
	const wrapper = mount(<CreateEvent />, events)
	const input = wrapper.find("input[name='IsAllDayEvent']")
	;(input.getDOMNode(): any).checked = true
	input.simulate("change")
	await submit(wrapper)
	expect(events.state.events).toContainEqual(
		expect.objectContaining({ IsAllDayEvent: true })
	)
})

it("presents a date input", async () => {
	const events = new Events({
		eventCreateFieldSet: [{ name: "Date", label: "Date", type: "date" }]
	})
	const wrapper = mount(<CreateEvent />, events)
	const input = wrapper.find(DateTime)
	expect(input.props()).toHaveProperty("name", "Date")
	expect(input.props()).toHaveProperty("timeFormat", false)
})

it("presents a datetime input", async () => {
	const events = new Events({
		eventCreateFieldSet: [
			{ name: "StartDateTime", label: "Start", type: "datetime" }
		]
	})
	const wrapper = mount(<CreateEvent />, events)
	const input = wrapper.find(DateTime)
	expect(input.props()).toHaveProperty("name", "StartDateTime")
	expect(input.props()).not.toHaveProperty("timeFormat")
})

it("gets a Date value from a datetime input", async () => {
	const events = new Events(eventsOpts)
	await events.newEvent(draft)
	const wrapper = mount(<CreateEvent />, events)
	const input = wrapper
		.find(DateTime)
		.filter("[name='StartDateTime']")
		.find(ReactDateTime)
	input.props().onChange(moment("2018-07-15T10:00-07:00"))
	await submit(wrapper)
	expect(events.state.events).toContainEqual(
		expect.objectContaining({
			StartDateTime: new Date("2018-07-15T10:00-07:00")
		})
	)
})

it("presents a textarea input", async () => {
	const events = new Events({
		eventCreateFieldSet: [
			{ name: "Description", label: "Description", type: "textarea" }
		]
	})
	const wrapper = mount(<CreateEvent />, events)
	const input = wrapper.find("textarea")
	expect(input.props().name).toBe("Description")
})

function mount(
	component: React.Node,
	events: Events = new Events(eventsOpts)
): enzyme.ReactWrapper {
	return enzyme.mount(<Provider inject={[events]}>{component}</Provider>)
}

async function submit(wrapper: enzyme.ReactWrapper) {
	const form = wrapper.find("form")
	form.props().onSubmit()
	await delay()
}
