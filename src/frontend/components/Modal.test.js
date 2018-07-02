/* @flow strict */

import { mount } from "enzyme"
import * as React from "react"
import Modal from "./Modal"

const onRequestClose = jest.fn()

afterEach(() => {
	onRequestClose.mockClear()
})

it("displays its children", () => {
	const wrapper = mount(
		<Modal onRequestClose={onRequestClose}>
			<div className="childComponent">content</div>
		</Modal>
	)
	const child = wrapper.find(".childComponent")
	expect(child.text()).toBe("content")
})

it("runs a callback when the user clicks 'close'", () => {
	const wrapper = mount(
		<Modal onRequestClose={onRequestClose}>
			<div>content</div>
		</Modal>
	)
	const closeControl = wrapper.find("button")
	closeControl.simulate("click")
	expect(onRequestClose).toHaveBeenCalledTimes(1)
})
