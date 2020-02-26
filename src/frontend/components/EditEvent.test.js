/* @flow strict */

import Timepicker from "@salesforce/design-system-react/components/time-picker"
import * as enzyme from "enzyme"
import { Formik } from "formik"
import moment from "moment-timezone"
import * as React from "react"
import { Provider } from "unstated"
import Events from "../containers/Events"
import * as af from "../models/Account.testFixtures"
import * as clf from "../models/CustomLabel.testFixtures"
import * as ef from "../models/Event.testFixtures"
import {
	eventCreateFieldSet,
	eventDescription,
	eventRecordTypeInfos
} from "../models/Event.testFixtures"
import { type QueryResult } from "../models/QueryResult"
import RestApi from "../api/RestApi"
import { delay, failIfMissing, inputElement } from "../testHelpers"
import EditEvent from "./EditEvent"
import SObjectForm from "./SObjectForm"
import { LabelProvider } from "./i18n/Label"

const draft = {
	Subject: "Meeting with Account",
	StartDateTime: new Date("2018-06-29T17:00Z"),
	EndDateTime: new Date("2018-06-29T18:00Z"),
	IsAllDayEvent: false,
	WhatId: "001f200001XrDsvAAF"
}

const restClient = RestApi("0000")
const timezone = moment.tz.guess()
const eventsOpts = {
	eventCreateFieldSet,
	eventRecordTypeInfos,
	restClient,
	timezone,
	userId: "testuserid"
}

afterEach(() => {
	jest.clearAllMocks()
})

it("requests event object description on mount", async () => {
	const events = new Events(eventsOpts)
	jest.spyOn(events, "getEventDescription")
	const wrapper = mount(<EditEvent />, events)
	expect(events.getEventDescription).toHaveBeenCalled()
})

it("renders a form", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft(draft)
	await prepopulate(events)
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

it("sets layout from default record type for new events", async () => {
	const events = new Events(eventsOpts)
	await prepopulate(events)
	const wrapper = mount(<EditEvent />, events)
	const recordType = events.state.eventRecordTypeInfos.find(
		({ defaultRecordTypeMapping }) => defaultRecordTypeMapping
	)
	if (recordType) {
		expect(events.state.eventLayout).toBe(
			ef.eventLayouts[recordType.urls.layout]
		)
	} else {
		throw new Error("expected to match layout")
	}
})

it("sets layout from custom record type for saved events", async () => {
	const events = new Events(eventsOpts)
	const recordType = events.state.eventRecordTypeInfos.find(
		({ recordTypeId }) => recordTypeId == "012000000000000AAA"
	)
	if (recordType) {
		await events.setEventDraft({
			...draft,
			RecordTypeId: recordType.recordTypeId
		})
		await prepopulate(events)
		const wrapper = mount(<EditEvent />, events)

		expect(events.state.eventLayout).toBe(
			ef.eventLayouts[recordType.urls.layout]
		)
	} else {
		throw new Error("expected to match layout")
	}
})

it("saves an event", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft(draft)
	await prepopulate(events)
	const wrapper = mount(<EditEvent />, events)
	await submit(wrapper)
	expect(events.state.events).toContainEqual(
		expect.objectContaining({ Subject: "Meeting with Account" })
	)
})

it("submits the form when the user clicks 'Save'", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft(draft)
	await prepopulate(events)
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
	await prepopulate(events)
	const wrapper = mount(<EditEvent />, events)
	const button = wrapper.find("button").filterWhere(n => n.text() === "Cancel")
	button.simulate("click")
	await delay()
	expect(events.state.eventDraft).toBeFalsy()
})

it("requests confirmation when the user clicks 'Delete'", async () => {
	const events = new Events(eventsOpts)
	const deleteEvent = jest.spyOn(events, "deleteEvent")
	await prepopulate(events)
	const event = events.state.events[0]
	await events.setEventDraft(event)
	const wrapper = mount(<EditEvent />, events)
	const button = wrapper.find("button").filterWhere(n => n.text() === "Delete")
	button.simulate("click")
	await delay()
	wrapper.update()
	expect(wrapper.find(".confirm-delete-content").text()).toMatch(
		"event will be permanently deleted"
	)
})

it("deletes event when the user clicks 'Delete' and confirms", async () => {
	const events = new Events(eventsOpts)
	const deleteEvent = jest.spyOn(events, "deleteEvent")
	await prepopulate(events)
	const event = events.state.events[0]
	await events.setEventDraft(event)
	const wrapper = mount(<EditEvent />, events)

	const deleteButton = wrapper
		.find("button")
		.filterWhere(n => n.text() === "Delete")
	deleteButton.simulate("click")
	await delay()
	wrapper.update()

	const confirmButton = wrapper
		.find("ConfirmDeleteDialog")
		.find("button")
		.filterWhere(n => n.text() === "Delete")
	confirmButton.simulate("click")
	expect(deleteEvent).toHaveBeenCalled()
})

it("closes confirmation dialog when user clicks 'Cancel'", async () => {
	const events = new Events(eventsOpts)
	const deleteEvent = jest.spyOn(events, "deleteEvent")
	await prepopulate(events)
	const event = events.state.events[0]
	await events.setEventDraft(event)
	const wrapper = mount(<EditEvent />, events)

	const deleteButton = wrapper
		.find("button")
		.filterWhere(n => n.text() === "Delete")
	deleteButton.simulate("click")
	await delay()
	wrapper.update()

	const cancelButton = wrapper
		.find("ConfirmDeleteDialog")
		.find("button")
		.filterWhere(n => n.text() === "Cancel")
	cancelButton.simulate("click")
	await delay()
	wrapper.update()

	expect(deleteEvent).not.toHaveBeenCalled()
	expect(wrapper.find(".confirm-delete-content")).not.toExist()
})

it("hides the 'Delete' button if the event being edited has never been saved", async () => {
	const events = new Events(eventsOpts)
	const deleteEvent = jest.spyOn(events, "deleteEvent")
	await prepopulate(events)
	await events.setEventDraft(draft)
	const wrapper = mount(<EditEvent />, events)
	const button = wrapper.find("button").filterWhere(n => n.text() === "Delete")
	expect(button).not.toExist()
})

it("displays errors if required fields are left blank", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft({ ...draft, Subject: "Meeting" })
	await prepopulate(events)
	const wrapper = mount(<EditEvent />, events)
	const input = wrapper.find(".slds-combobox input")
	inputElement(input).value = ""
	input.simulate("change")
	await delay()
	expect(wrapper.find(".slds-combobox")).toIncludeText("This field is required")
})

it("displays account name and billing address when creating a new event", async () => {
	const account = failIfMissing(
		af.accountQueryResult.records.find(a => a.Name === "Edge Communications")
	)
	const client = await restClient
	jest.spyOn(client, "query").mockImplementation(
		async (query): Promise<QueryResult> => {
			if (
				query.match(
					/SELECT .*\bBillingAddress\b.* FROM Account WHERE Id = '001f200001XrDsvAAF'/
				)
			) {
				return {
					totalSize: 1,
					done: true,
					records: [
						{
							BillingAddress: af.address,
							attributes: {
								type: "Account",
								url: "/services/data/v40.0/sobjects/Account/001f200001XrDsvAAF"
							}
						}
					]
				}
			} else {
				return {
					done: true,
					totalSize: 0,
					records: []
				}
			}
		}
	)
	const events = new Events(eventsOpts)
	await events.setEventDraft(
		events.newEvent({ account, date: moment(draft.StartDateTime) }),
		account
	)
	const wrapper = mount(<EditEvent />, events)
	await delay(100)
	wrapper.update()
	expect(events.state.errors).toEqual([])
	expect(wrapper).toContainReact(
		<a href="/lightning/r/Account/001f200001XrDsvAAF/view">
			Edge Communications
		</a>
	)
	expect(wrapper.text()).toMatch(/525 S. Lexington Ave.*Burlington/)
})

it("displays account name and billing address when editing", async () => {
	const referencedRecords = {
		What: {
			Name: "Edge Communications",
			attributes: {
				type: "Name",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDsvAAF"
			}
		},
		attributes: {
			type: "Event",
			url: "/services/data/v40.0/sobjects/Event/someEventId"
		}
	}
	const client = await restClient
	jest.spyOn(client, "query").mockImplementation(
		async (query): Promise<QueryResult> => {
			if (
				query.match(
					/SELECT .*\bWhat.Name\b.* FROM Event WHERE Id = 'someEventId'/
				)
			) {
				return {
					totalSize: 1,
					done: true,
					records: [referencedRecords]
				}
			} else if (
				query.match(
					/SELECT .*\bBillingAddress\b.* FROM Account WHERE Id = '001f200001XrDsvAAF'/
				)
			) {
				return {
					totalSize: 1,
					done: true,
					records: [
						{
							BillingAddress: af.address,
							attributes: {
								type: "Account",
								url: "/services/data/v40.0/sobjects/Account/001f200001XrDsvAAF"
							}
						}
					]
				}
			} else {
				return {
					done: true,
					totalSize: 0,
					records: []
				}
			}
		}
	)
	const events = new Events(eventsOpts)
	await events.setEventDraft({ ...draft, Id: "someEventId" })
	const wrapper = mount(<EditEvent />, events)
	await delay(100)
	wrapper.update()
	expect(events.state.errors).toEqual([])
	expect(wrapper).toContainReact(
		<a href="/lightning/r/Account/001f200001XrDsvAAF/view">
			Edge Communications
		</a>
	)
	expect(wrapper.text()).toMatch(/525 S. Lexington Ave.*Burlington/)
})

it("hides time inputs if 'IsAllDay' is selected", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft({ ...draft, IsAllDayEvent: true })
	await prepopulate(events)
	const wrapper = mount(<EditEvent />, events)
	expect(wrapper.find(Timepicker).exists()).toBe(false)

	const formik = wrapper.find(Formik).instance()
	formik.setFieldValue("IsAllDayEvent", false)
	wrapper.update()
	expect(wrapper.find(Timepicker).exists()).toBe(true)

	formik.setFieldValue("IsAllDayEvent", true)
	wrapper.update()
	expect(wrapper.find(Timepicker).exists()).toBe(false)
})

it("prepopulates default value in combobox and picklist inputs", async () => {
	const events = new Events(eventsOpts)
	await events.setEventDraft({})
	await prepopulate(events)
	const wrapper = mount(<EditEvent />, events)
	expect(
		wrapper.find("input").filterWhere(n => n.prop("value") === "Meeting")
	).toExist()
	expect(wrapper.find("select[name='ShowAs']").props()).toHaveProperty(
		"value",
		"Busy"
	)
	await submit(wrapper)
	expect(events.state.events).toContainEqual(
		expect.objectContaining({ Subject: "Meeting", ShowAs: "Busy" })
	)
})

// Unmount React tree after each test to avoid errors about missing `document`,
// and to avoid slowdown from accumulated React trees.
let _wrapper: enzyme.ReactWrapper
afterEach(() => {
	if (_wrapper) {
		_wrapper.unmount()
	}
})

function mount(
	component: React.Node,
	events: Events = new Events(eventsOpts)
): enzyme.ReactWrapper {
	_wrapper = enzyme.mount(
		<Provider inject={[events]}>
			<LabelProvider value={clf.labels}>{component}</LabelProvider>
		</Provider>
	)
	return _wrapper
}

async function submit(wrapper: enzyme.ReactWrapper) {
	const form = wrapper.find("form")
	form.props().onSubmit()
	await delay()
}

async function prepopulate(events: Events): Promise<void> {
	await Promise.all([
		events._fetchEventDescription(),
		events._fetchEventLayout(),
		events._fetchEvents({})
	])
}
