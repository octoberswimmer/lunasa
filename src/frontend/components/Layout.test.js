/* @flow strict */

import * as enzyme from "enzyme"
import * as React from "react"
import { Provider } from "unstated"
import * as clf from "../models/CustomLabel.testFixtures"
import Events from "../containers/Events"
import * as ef from "../models/Event.testFixtures"
import Layout from "./Layout"
import { LabelProvider } from "./i18n/Label"
import RestApi from "../api/RestApi"
import EventModel from "../api/Events"
import moment from "moment-timezone"

const timezone = moment.tz.guess()
const restClient = RestApi("0000")
const eventsOpts = {
	eventCreateFieldSet: ef.eventCreateFieldSet,
	eventRecordTypeInfos: ef.eventRecordTypeInfos,
	remoteObject: EventModel,
	restClient,
	timezone,
	userId: "testuserid"
}

it("displays record types in a select", async () => {
	const events = new Events(eventsOpts)
	const wrapper = mount(
		<Layout eventRecordTypeInfos={ef.eventRecordTypeInfos} />,
		events
	)
	const options = wrapper.find(".slds-select.select-sort-field option")
	expect(options.length).toBe(ef.eventRecordTypeInfos.length)

	for (const recordType of ef.eventRecordTypeInfos) {
		const option = options.find(`[value="${recordType.recordTypeId}"]`)

		expect(option.text()).toBe(recordType.name)
	}
})

it("doesn't display record types if there is only one", async () => {
	const events = new Events(eventsOpts)
	const wrapper = mount(
		<Layout eventRecordTypeInfos={[ef.eventRecordTypeInfos[0]]} />,
		events
	)
	const options = wrapper.find(".slds-select.select-sort-field option")
	expect(options.length).toBe(0)
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
