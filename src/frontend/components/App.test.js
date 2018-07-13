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
import {
	events as eventFixtures,
	eventCreateFieldSet
} from "../models/Event.testFixtures"
import * as lf from "../models/ListView.testFixtures"
import { delay, failIfMissing } from "../testHelpers"
import App from "./App"
import AccountList from "./AccountList"
import DroppableCalendar from "./DroppableCalendar"
import EditEvent from "./EditEvent"
import FullCalendar from "./FullCalendar"

const restClient = RestApi("0000")

const accountsOpts = {
	accountFieldSet: af.accountFieldSet,
	restClient
}

const eventsOpts = { eventCreateFieldSet, restClient }

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
	const events = new Events(eventsOpts)
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
	const events = new Events(eventsOpts)
	const wrapper = mount(<App />, { events })
	await events.getEventsByDateRange(moment(), moment())
	wrapper.update()
	const calendar = wrapper.find(FullCalendar)
	expect(calendar.props()).toHaveProperty(
		"events",
		eventFixtures.map(forFullcalendar)
	)
})

it("sets an event draft when a calendar event is clicked", async () => {
	initializeCalendar.mockRestore()
	const events = new Events(eventsOpts)
	jest.spyOn(events, "setEventDraft")
	await events.setState({ events: eventFixtures.slice(0, 1) })
	const wrapper = mount(<App />, { events })
	const calendarEvent = failIfMissing(
		wrapper.getDOMNode().querySelector(".fc-event")
	)
	calendarEvent.click()
	expect(events.setEventDraft).toHaveBeenCalledWith(eventFixtures[0])
})

it("displays an error if something went wrong", async () => {
	const accounts = new Accounts(accountsOpts)
	const events = new Events(eventsOpts)
	for (const container of [accounts, events]) {
		const wrapper = mount(<App />, { accounts, events })
		await container.setState({
			errors: [new Error("an error occurred")]
		})
		expect(wrapper.text()).toMatch("an error occurred")
	}
})

it("dismisses errors when the user clicks the close control on a toast", async () => {
	const accounts = new Accounts(accountsOpts)
	const events = new Events(eventsOpts)
	for (const container of [accounts, events]) {
		const wrapper = mount(<App />, { accounts, events })
		await container.setState({
			errors: [new Error("an error occurred")]
		})
		expect(wrapper.text()).toMatch("an error occurred")
		wrapper.update()
		wrapper.find(".slds-notify button[title='Close']").forEach(closeControl => {
			closeControl.simulate("click")
		})
		await delay()
		expect(wrapper.text()).not.toMatch("an error occurref")
	}
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
	const events = new Events(eventsOpts)
	const wrapper = mount(<App />, { accounts, events })
	const calendar = wrapper.find(DroppableCalendar)
	const account = failIfMissing(
		af.accountQueryResult.records.find(r => r.Name === "United Oil & Gas, UK")
	)
	await accounts.setState({ accountQueryResult: af.accountQueryResult })
	const date = moment()
	calendar.props().onDrop({ accountUrl: account.attributes.url, date })
	await delay()
	expect(events.state.eventDraft).toMatchObject({
		StartDateTime: expect.any(Date),
		EndDateTime: expect.any(Date)
	})
})

it("displays event form when a new event draft is present", async () => {
	const accounts = new Accounts(accountsOpts)
	const events = new Events(eventsOpts)
	await events.setEventDraft({ Subject: "Meeting" })
	const wrapper = mount(<App />, { accounts, events })
	const form = wrapper.find(EditEvent)
	expect(form.exists()).toBe(true)
	expect(form.find("h2").text()).toBe("New Event")
})

it("displays event form when a draft of changes to an existing event is present", async () => {
	const accounts = new Accounts(accountsOpts)
	const events = new Events(eventsOpts)
	await events.setEventDraft({ Id: "1", Subject: "Meeting" })
	const wrapper = mount(<App />, { accounts, events })
	const form = wrapper.find(EditEvent)
	expect(form.exists()).toBe(true)
	expect(form.find("h2").text()).toBe("Edit Meeting")
})

it("assumes that error messages have already been HTML-escaped", async () => {
	const accounts = new Accounts(accountsOpts)
	const events = new Events(eventsOpts)
	await events.setState({ errors: [new Error("I can&#39;t do that.")] })
	await events.setEventDraft({ Id: "1", Subject: "Meeting" })
	const wrapper = mount(<App />, { accounts, events })
	expect(wrapper.text()).toMatch("I can't do that.")
})

// Unmount React tree after each test to avoid errors about missing `document`,
// and to avoid slowdown from accumulated React trees.
let _wrapper: enzyme.ReactWrapper
afterEach(() => {
	if (_wrapper) {
		_wrapper.unmount()
	}
})

// Helper that wraps `<App/>` with a necessary `<Provider>` from unstated.
function mount(
	app: React.Node,
	containers?: {| accounts?: Accounts, events?: Events |}
): enzyme.ReactWrapper {
	const accounts =
		(containers && containers.accounts) || new Accounts(accountsOpts)
	const events = (containers && containers.events) || new Events(eventsOpts)
	_wrapper = enzyme.mount(
		<Provider inject={[accounts, events]}>
			<DragDropContextProvider backend={TestBackend}>
				{app}
			</DragDropContextProvider>
		</Provider>
	)
	return _wrapper
}
