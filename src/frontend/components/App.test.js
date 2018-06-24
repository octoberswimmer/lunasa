/* @flow strict */

import * as enzyme from "enzyme"
import moment from "moment"
import * as React from "react"
import { Provider } from "unstated"
import RestApi from "../api/RestApi"
import Accounts from "../containers/Accounts"
import Events from "../containers/Events"
import * as af from "../models/Account.testFixtures"
import { forFullcalendar } from "../models/Event"
import { events as eventFixtures } from "../models/Event.testFixtures"
import * as lf from "../models/ListView.testFixtures"
import { delay } from "../testHelpers"
import App from "./App"
import FullCalendar from "./FullCalendar"
import SelectAccounts from "./SelectAccounts"

const accountsOpts = {
	accountFieldSet: af.accountFieldSet,
	restClient: RestApi("0000")
}

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
		fieldSet: af.accountFieldSet,
		listViews: lf.accountListViews,
		onSelectListView: expect.any(Function)
	})
})

it("requests accounts when an account list view is selected", async () => {
	const accounts = new Accounts(accountsOpts)
	const selectListViewSpy = jest.spyOn(accounts, "selectListView")
	const wrapper = mount(<App />, { accounts })
	await delay()
	const listView = lf.accountListViews.listviews[0]
	const selectAccounts = wrapper.find(SelectAccounts)
	selectAccounts.props().onSelectListView(listView)
	expect(selectListViewSpy).toHaveBeenCalledWith(listView)
})

it("displays account results", async () => {
	const accounts = new Accounts(accountsOpts)
	const wrapper = mount(<App />, { accounts })
	await delay()
	await accounts.setState({ accountQueryResult: af.accountQueryResult })
	wrapper.update()
	const selectAccounts = wrapper.find(SelectAccounts)
	expect(selectAccounts.props()).toHaveProperty(
		"accounts",
		af.accountQueryResult.records
	)
})

// Helper that wraps `<App/>` with a necessary `<Provider>` from unstated.
function mount(
	app: React.Node,
	containers?: {| accounts?: Accounts, events?: Events |}
): enzyme.ReactWrapper {
	const accounts =
		(containers && containers.accounts) || new Accounts(accountsOpts)
	const events = (containers && containers.events) || new Events()
	return enzyme.mount(<Provider inject={[accounts, events]}>{app}</Provider>)
}
