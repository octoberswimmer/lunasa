/* @flow strict */

import * as enzyme from "enzyme"
import * as React from "react"
import { Provider } from "unstated"
import Events from "../containers/Events"
import { delay } from "../testHelpers"
import CreateEvent from "./CreateEvent"

const draft = {
	Subject: "Meeting with Account",
	StartDateTime: new Date("2018-06-29T17:00Z"),
	EndDateTime: new Date("2018-06-29T18:00Z")
}

it("creates an event", async () => {
	const events = new Events()
	await events.newEvent(draft)
	const wrapper = mount(<CreateEvent />, events)
	await submit(wrapper)
	expect(events.state.events).toContainEqual(
		expect.objectContaining({ Subject: "Meeting with Account" })
	)
})

function mount(
	component: React.Node,
	events: Events = new Events()
): enzyme.ReactWrapper {
	return enzyme.mount(<Provider inject={[events]}>{component}</Provider>)
}

async function submit(wrapper: enzyme.ReactWrapper) {
	const form = wrapper.find("form")
	form.props().onSubmit()
	await delay()
}
