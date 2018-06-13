/* @flow strict */

import * as enzyme from "enzyme"
import moment from "moment"
import * as React from "react"
import { Provider } from "unstated"
import Events from "../containers/Events"
import { forFullcalendar } from "../models/Event"
import { events as eventFixtures } from "../models/Event.testFixtures"
import { delay } from "../testHelpers"
import App from "./App"
import FullCalendar from "./FullCalendar"

it("renders a calendar", async () => {
	const wrapper = mount(<App />)
	const calendar = wrapper.find(FullCalendar)
	expect(calendar.exists()).toBe(true)
})

it("requests events by date range", async () => {
	const container = new Events()
	jest.spyOn(container, "getEventsByDateRange")
	const wrapper = mount(<App />, container)
	expect(container.getEventsByDateRange).toHaveBeenCalledWith(
		expect.any(moment),
		expect.any(moment)
	)
	const start = container.getEventsByDateRange.mock.calls[0][0]
	const end = container.getEventsByDateRange.mock.calls[0][1]
	expect(start.isBefore(end)).toBe(true)
})

it("displays events in calendar", async () => {
	const container = new Events()
	const wrapper = mount(<App />, container)
	await delay(10)
	wrapper.update()
	const calendar = wrapper.find(FullCalendar)
	expect(calendar.props()).toHaveProperty(
		"events",
		eventFixtures.map(forFullcalendar)
	)
})

it("displays an error if something went wrong", async () => {
	const container = new Events()
	const wrapper = mount(<App />, container)
	await container.setState({
		errors: [new Error("an error occurred")]
	})
	expect(wrapper.text()).toMatch("an error occurred")
})

// Helper that wraps `<App/>` with a necessary `<Provider>` from unstated.
function mount(
	app: React.Node,
	events: Events = new Events()
): enzyme.ReactWrapper {
	return enzyme.mount(<Provider inject={[events]}>{app}</Provider>)
}
