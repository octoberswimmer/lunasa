/* @flow strict */

import * as enzyme from "enzyme"
import { type JQuery, type JQueryStatic, Calendar } from "fullcalendar"
import jQuery from "jquery"
import * as React from "react"
import FullCalendar from "./FullCalendar"

// Use the jQuery interface exported by fullcalendar, which adds the
// `$.fn.fullCalendar()` function.
const $: JQueryStatic = (jQuery: any)

it("displays a calendar", () => {
	const wrapper = mount(<FullCalendar />)
	const calendar = getCalendar(wrapper)
	expect(calendar).toBeInstanceOf(Calendar)
})

it("initializes calendar with options based on props", () => {
	const wrapper = mount(<FullCalendar options={{ weekends: false }} />)
	const calendar = getCalendar(wrapper)
	expect(calendar.option("weekends")).toBe(false)
})

it("updates calendar options when props change", async () => {
	const wrapper = mount(<FullCalendar />)
	const calendar = getCalendar(wrapper)
	expect(getCalendar(wrapper).option("weekends")).toBe(true)
	wrapper.setProps({ options: { weekends: false } })
	expect(getCalendar(wrapper).option("weekends")).toBe(false)
})

it("destroys calendar when unmounting", () => {
	function CalendarContainer(props: { showCalendar: boolean }) {
		return <div>{props.showCalendar ? <FullCalendar /> : null}</div>
	}
	const wrapper = mount(<CalendarContainer showCalendar={true} />)
	const $elem: JQuery = ($(wrapper.getDOMNode()).find(".fc"): any)
	expect($elem.length).toBe(1)
	expect($elem.fullCalendar("getCalendar")).toBeInstanceOf(Calendar)
	wrapper.setProps({ showCalendar: false })
	expect($elem.fullCalendar("getCalendar")).toBeInstanceOf(Calendar)
})

function getCalendar(wrapper: enzyme.ReactWrapper): Calendar {
	return $(wrapper.getDOMNode()).fullCalendar("getCalendar")
}

// Unmount React tree after each test to avoid errors about missing `document`,
// and to avoid slowdown from accumulated React trees.
let _wrapper: enzyme.ReactWrapper
afterEach(() => {
	if (_wrapper) {
		_wrapper.unmount()
	}
})

function mount(component: React.Node): enzyme.ReactWrapper {
	_wrapper = enzyme.mount(component)
	return _wrapper
}
