/* @flow strict */

import * as enzyme from "enzyme"
import moment from "moment"
import * as React from "react"
import { Provider } from "unstated"
import Accounts from "../containers/Accounts"
import Events from "../containers/Events"
import { forFullcalendar } from "../models/Event"
import { events as eventFixtures } from "../models/Event.testFixtures"
import * as f from "../models/ListView.testFixtures"
import { delay } from "../testHelpers"
import App from "./App"
import FullCalendar from "./FullCalendar"
import SelectAccounts from "./SelectAccounts"

it("renders a calendar", async () => {
	const wrapper = mount(<App />)
	const calendar = wrapper.find(FullCalendar)
	expect(calendar.exists()).toBe(true)
})

it("requests events by date range", async () => {
	const events = new Events()
	jest.spyOn(events, "getEventsByDateRange")
	const wrapper = mount(<App />, { events })
	expect(events.getEventsByDateRange).toHaveBeenCalledWith(
		expect.any(moment),
		expect.any(moment)
	)
	const start = events.getEventsByDateRange.mock.calls[0][0]
	const end = events.getEventsByDateRange.mock.calls[0][1]
	expect(start.isBefore(end)).toBe(true)
})

it("displays events in calendar", async () => {
	const events = new Events()
	const wrapper = mount(<App />, { events })
	await delay(10)
	wrapper.update()
	const calendar = wrapper.find(FullCalendar)
	expect(calendar.props()).toHaveProperty(
		"events",
		eventFixtures.map(forFullcalendar)
	)
})

it("displays an error if something went wrong", async () => {
	const events = new Events()
	const wrapper = mount(<App />, { events })
	await events.setState({
		errors: [new Error("an error occurred")]
	})
	expect(wrapper.text()).toMatch("an error occurred")
})

it("displays account list view selector", async () => {
	const wrapper = mount(<App />)
	await delay(10)
	wrapper.update()
	const selectAccounts = wrapper.find(SelectAccounts)
	expect(selectAccounts.props()).toMatchObject({
		listViews: f.accountListViews,
		onSelectListView: expect.any(Function),
		results: null
	})
})

it("requests accounts when an account list view is selected", async () => {
	const accounts = new Accounts()
	const selectListViewSpy = jest.spyOn(accounts, "selectListView")
	const wrapper = mount(<App/>, { accounts })
	await delay()
	const listView = f.accountListViews.listviews[0]
	const selectAccounts = wrapper.find(SelectAccounts)
	selectAccounts.props().onSelectListView(listView)
	expect(selectListViewSpy).toHaveBeenCalledWith(listView)
})

it("displays account results", async () => {
	const accounts = new Accounts()
	const wrapper = mount(<App/>, { accounts })
	await delay()
	await accounts.setState({ results: f.accountResults })
	wrapper.update()
	const selectAccounts = wrapper.find(SelectAccounts)
	expect(selectAccounts.props()).toHaveProperty("results", f.accountResults)
})

// Helper that wraps `<App/>` with a necessary `<Provider>` from unstated.
function mount(
	app: React.Node,
	containers?: {| accounts?: Accounts, events?: Events |}
): enzyme.ReactWrapper {
	const accounts = containers && containers.accounts || new Accounts()
	const events = containers && containers.events || new Events()
	return enzyme.mount(<Provider inject={[accounts, events]}>{app}</Provider>)
}
