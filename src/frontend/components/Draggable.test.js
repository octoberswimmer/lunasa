/* @flow strict */

import * as enzyme from "enzyme"
import * as React from "react"
import Draggable, { getIdentifierFromDraggable } from "./Draggable"

const identifier = { type: "Test", url: "test:///" }

it("renders its child", () => {
	const wrapper = mount(
		<Draggable>
			<div>child content</div>
		</Draggable>
	)
	expect(wrapper).toHaveText("child content")
})

it("identifies its child when dragging", () => {
	const wrapper = mount(
		<Draggable identifier={identifier}>
			<div>child content</div>
		</Draggable>
	)
	const elem = wrapper.find(".draggable").getDOMNode()
	expect(getIdentifierFromDraggable(elem)).toEqual(identifier)
})

function mount(component: React.Node): enzyme.ReactWrapper {
	return enzyme.mount(component)
}
