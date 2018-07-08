/* @flow strict */

import * as enzyme from "enzyme"
import { Formik } from "formik"
import * as React from "react"
import { Provider } from "unstated"
import Events from "../containers/Events"
import {
	eventCreateFieldSet,
	eventDescription
} from "../models/Event.testFixtures"
import { delay } from "../testHelpers"
import EditEvent from "./EditEvent"
import SObjectForm from "./SObjectForm"

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
	const wrapper = mount(<EditEvent />, events)
	expect(events.fetchEventDescription).toHaveBeenCalled()
})

it("renders a form", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft(draft)
	await events.fetchEventDescription()
	const wrapper = mount(<EditEvent />, events)
	const form = wrapper.find(SObjectForm)
	expect(form.props()).toMatchObject({
		description: eventDescription,
		fieldSet: eventCreateFieldSet
	})
	const formik = wrapper.find(Formik)
	expect(formik.props()).toMatchObject({
		initialValues: draft
	})
})

it("saves an event", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft(draft)
	const wrapper = mount(<EditEvent />, events)
	await submit(wrapper)
	expect(events.state.events).toContainEqual(
		expect.objectContaining({ Subject: "Meeting with Account" })
	)
})

it("submits the form when the user clicks 'Save'", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft(draft)
	const wrapper = mount(<EditEvent />, events)
	const button = wrapper.find("button").filterWhere(n => n.text() === "Save")
	button.simulate("click")
	await delay()
	expect(events.state.events).toContainEqual(
		expect.objectContaining({ Subject: "Meeting with Account" })
	)
})

it("discards event draft when the user clicks 'Cancel'", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft(draft)
	const wrapper = mount(<EditEvent />, events)
	const button = wrapper.find("button").filterWhere(n => n.text() === "Cancel")
	button.simulate("click")
	await delay()
	expect(events.state.eventDraft).toBeFalsy()
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
