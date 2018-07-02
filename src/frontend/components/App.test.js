/* @flow strict */

import * as enzyme from "enzyme"
import moment from "moment"
import * as React from "react"
import { DragDropContextProvider } from "react-dnd"
import TestBackend from "react-dnd-test-backend"
import { Provider } from "unstated"
import RestApi from "../api/RestApi"
import Accounts from "../containers/Accounts"
import Events from "../containers/Events"
import * as af from "../models/Account.testFixtures"
import { forFullcalendar } from "../models/Event"
import { events as eventFixtures } from "../models/Event.testFixtures"
import * as lf from "../models/ListView.testFixtures"
import { delay, failIfMissing } from "../testHelpers"
import App from "./App"
import AccountList from "./AccountList"
import DroppableCalendar from "./DroppableCalendar"
import FullCalendar from "./FullCalendar"

const accountsOpts = {
	accountFieldSet: af.accountFieldSet,
	restClient: RestApi("0000")
}

var initializeCalendar: JestMockFn<[], void>

beforeEach(() => {
	// Skip calendar initialization to speed up tests. To proceed with calendar
	// initialization in a test call `initializeCalendar.mockRestore()`.
	initializeCalendar = jest
		.spyOn(FullCalendar.prototype, "initializeCalendar")
		.mockImplementation(() => {})
})

it("renders a calendar", async () => {
	const wrapper = mount(<App />)
	const calendar = wrapper.find(FullCalendar)
	expect(calendar.exists()).toBe(true)
})

it("requests events by date range", async () => {
	initializeCalendar.mockRestore()
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
	await events.getEventsByDateRange(moment(), moment())
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

it("displays account list component", async () => {
	const wrapper = mount(<App />)
	await delay(10)
	wrapper.update()
	const accountList = wrapper.find(AccountList)
	expect(accountList.props()).toMatchObject({
		fieldSet: af.accountFieldSet
	})
})

it("creates a new event draft when an account card is dropped on the calendar", async () => {
	const accounts = new Accounts(accountsOpts)
	const events = new Events()
	const wrapper = mount(<App />, { accounts, events })
	const calendar = wrapper.find(DroppableCalendar)
	const account = failIfMissing(
		af.accountQueryResult.records.find(r => r.Name === "United Oil & Gas, UK")
	)
	await accounts.setState({ accountQueryResult: af.accountQueryResult })
	const date = moment()
	calendar.props().onDrop({ accountUrl: account.attributes.url, date })
	await delay()
	expect(events.state.newEvent).toMatchObject({
		Subject: "Meeting with United Oil & Gas, UK",
		StartDateTime: expect.any(Date),
		EndDateTime: expect.any(Date)
	})
})

// Helper that wraps `<App/>` with a necessary `<Provider>` from unstated.
function mount(
	app: React.Node,
	containers?: {| accounts?: Accounts, events?: Events |}
): enzyme.ReactWrapper {
	const accounts =
		(containers && containers.accounts) || new Accounts(accountsOpts)
	const events = (containers && containers.events) || new Events()
	return enzyme.mount(
		<Provider inject={[accounts, events]}>
			<DragDropContextProvider backend={TestBackend}>
				{app}
			</DragDropContextProvider>
		</Provider>
	)
}
