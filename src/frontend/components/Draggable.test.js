/* @flow strict */

import * as enzyme from "enzyme"
import * as React from "react"
import { DragDropContext } from "react-dnd"
import TestBackend from "react-dnd-test-backend"
import Draggable from "./Draggable"

const item = { id: "test item" }

it("renders its child", () => {
	const wrapper = mount(
		<Draggable item={item}>{() => <div>child content</div>}</Draggable>
	)
	expect(wrapper.text()).toBe("child content")
})

it("identifies its child when dragging", () => {
	const wrapper = mount(
		<Draggable item={item}>{() => <div>child content</div>}</Draggable>
	)
	const manager = wrapper.instance().getManager()
	const backend = manager.getBackend()
	const monitor = manager.getMonitor()
	const draggable = wrapper.find("DragSource(Draggable)")
	backend.simulateBeginDrag([draggable.instance().getHandlerId()])
	expect(monitor.getItem()).toMatchObject(item)
})

it("exposing dragging state to its child", () => {
	const wrapper = mount(
		<Draggable item={item}>
			{({ isDragging }) => (
				<div>{isDragging ? "is dragging" : "is not dragging"}</div>
			)}
		</Draggable>
	)
	const manager = wrapper.instance().getManager()
	const backend = manager.getBackend()
	const draggable = wrapper.find("DragSource(Draggable)")
	expect(wrapper.text()).toBe("is not dragging")
	backend.simulateBeginDrag([draggable.instance().getHandlerId()])
	expect(wrapper.text()).toBe("is dragging")
})

function mount(component: React.Node): enzyme.ReactWrapper {
	function Identity(props: { children: React.Node }) {
		return props.children
	}
	const DragDropContextProvider = DragDropContext(TestBackend)(Identity)
	return enzyme.mount(
		<DragDropContextProvider backend={TestBackend}>
			{component}
		</DragDropContextProvider>
	)
}
