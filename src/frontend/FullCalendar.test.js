/* @flow string */

import { type ReactWrapper, mount } from "enzyme"
import { Calendar } from "fullcalendar"
import $ from "jquery"
import * as React from "react"
import FullCalendar from "./FullCalendar"

it("displays a calendar", () => {
	const wrapper = mount(<FullCalendar />)
	const calendar = getCalendar(wrapper)
	expect(calendar).toBeInstanceOf(Calendar)
})

it("reinitializes calendar when props change", () => {
	const wrapper = mount(<FullCalendar />)
	const calendar = getCalendar(wrapper)
	expect(getCalendar(wrapper).option("weekends")).toBe(true)
	wrapper.setProps({ weekends: false })
	expect(getCalendar(wrapper).option("weekends")).toBe(false)
})

function getCalendar(wrapper: ReactWrapper): Object {
	return $(wrapper.getDOMNode()).fullCalendar("getCalendar")
}
