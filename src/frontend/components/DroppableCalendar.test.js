/* @flow strict */

import * as enzyme from "enzyme"
import moment from "moment"
import * as React from "react"
import { DragDropContext } from "react-dnd"
import TestBackend from "react-dnd-test-backend"
import * as af from "../models/Account.testFixtures"
import { delay } from "../testHelpers"
import AccountCard from "./AccountCard"
import DroppableCalendar from "./DroppableCalendar"
import FullCalendar from "./FullCalendar"

const onDrop = jest.fn()

afterEach(() => {
	onDrop.mockClear()
})

const options = {
	// Toolbar controls to be displayed in calendar header
	header: {
		left: "title",
		right: "basicWeek,month today prev,next"
	}
}

const record = {
	attributes: { type: "test", url: "test://" },
	CreatedDate: "2018-06-01T20:35:50.000+0000",
	Name: "Test Account",
	Phone: "(520) 773-9050",
	Site: null
}

it("renders the calendar", () => {
	const wrapper = mount(<DroppableCalendar onDrop={onDrop} options={options} />)
	const calendar = wrapper.find(FullCalendar)
	expect(calendar.props()).toHaveProperty("options", options)
})

it("receives drop events from account cards", () => {
	const wrapper = mount(
		<div>
			<AccountCard fieldSet={af.accountFieldSet} record={record} />
			<DroppableCalendar onDrop={onDrop} options={options} />
		</div>
	)
	const today = moment()
	const monitor = wrapper
		.instance()
		.getManager()
		.getMonitor()
	const targetElem = findCalendarElement(wrapper.getDOMNode(), today)
	mockBoundingClientRect(targetElem)
	jest
		.spyOn(monitor, "getClientOffset")
		.mockReturnValue(offsetForElement(targetElem))

	const accountCard = wrapper.find("DragSource(Draggable)")
	const calendar = wrapper.find("DropTarget(DroppableCalendar)")
	simulateDragDrop(wrapper, { draggable: accountCard, dropTarget: calendar })

	expect(onDrop).toHaveBeenCalledTimes(1)
	expect(onDrop.mock.calls[0][0].date.isSame(today, "day")).toBe(true)
	expect(onDrop.mock.calls[0][0].accountUrl).toBe(record.attributes.url)
})

it("highlights calendar elements when dragging over", () => {
	expect.assertions(8)
	const wrapper = mount(
		<div>
			<AccountCard fieldSet={af.accountFieldSet} record={record} />
			<DroppableCalendar onDrop={onDrop} options={options} />
		</div>
	)
	const [dayA, dayB] = Array.from(
		wrapper.getDOMNode().querySelectorAll(`.fc-day[data-date]`)
	).slice(0, 2)
	mockBoundingClientRect(dayA, dayB)

	const accountCard = wrapper.find("DragSource(Draggable)")
	const calendar = wrapper.find("DropTarget(DroppableCalendar)")
	const monitor = wrapper
		.instance()
		.getManager()
		.getMonitor()

	expect(dayA.classList.contains("fc-highlight")).toBe(false)
	expect(dayB.classList.contains("fc-highlight")).toBe(false)

	// Drag and hover over `dayA`
	jest.spyOn(monitor, "getClientOffset").mockReturnValue(offsetForElement(dayA))
	simulateHover(
		wrapper,
		{ draggable: accountCard, dropTarget: calendar },
		() => {
			expect(dayA.classList.contains("fc-highlight")).toBe(true)
			expect(dayB.classList.contains("fc-highlight")).toBe(false)
		}
	)

	// Drag and hover over `dayB`
	jest.spyOn(monitor, "getClientOffset").mockReturnValue(offsetForElement(dayB))
	simulateHover(
		wrapper,
		{ draggable: accountCard, dropTarget: calendar },
		() => {
			expect(dayA.classList.contains("fc-highlight")).toBe(false)
			expect(dayB.classList.contains("fc-highlight")).toBe(true)
		}
	)

	expect(dayA.classList.contains("fc-highlight")).toBe(false)
	expect(dayB.classList.contains("fc-highlight")).toBe(false)
})

function simulateDragDrop(
	root: enzyme.ReactWrapper,
	{
		draggable,
		dropTarget
	}: {| draggable: enzyme.ReactWrapper, dropTarget: enzyme.ReactWrapper |}
) {
	const manager = root.instance().getManager()
	const backend = manager.getBackend()
	const sourceHandler = draggable.instance().getHandlerId()
	const targetHandler = dropTarget.instance().getHandlerId()
	backend.simulateBeginDrag([sourceHandler])
	backend.simulateHover([targetHandler])
	backend.simulateDrop()
	backend.simulateEndDrag([sourceHandler])
}

function simulateHover(
	root: enzyme.ReactWrapper,
	{
		draggable,
		dropTarget
	}: {| draggable: enzyme.ReactWrapper, dropTarget: enzyme.ReactWrapper |},
	cb: () => void
) {
	const manager = root.instance().getManager()
	const backend = manager.getBackend()
	const sourceHandler = draggable.instance().getHandlerId()
	const targetHandler = dropTarget.instance().getHandlerId()
	backend.simulateBeginDrag([sourceHandler])
	backend.simulateHover([targetHandler])
	cb()
	backend.simulateEndDrag([sourceHandler])
}

// Each day on the calendar is represented by a `td` element
function findCalendarElement(
	root: HTMLElement,
	date: moment$Moment
): HTMLElement {
	const dateStr = date.format("YYYY-MM-DD")
	const elem = root.querySelector(`.fc-day[data-date="${dateStr}"]`)
	if (!elem) {
		throw new Error("unable to find calendar element")
	}
	return elem
}

var lastX = 100
function uniqueRect() {
	const x = lastX
	lastX += 100
	return {
		left: x,
		right: x + 20,
		top: 100,
		bottom: 120,
		width: 20,
		height: 20
	}
}

// enzyme does not make elements visible, so bounding rectangles are not
// computed correctly. To work around this, replace bounding rectangle
// method with a mock.
function mockBoundingClientRect(...elems: HTMLElement[]) {
	for (const elem of elems) {
		jest.spyOn(elem, "getBoundingClientRect").mockReturnValue(uniqueRect())
	}
}

function offsetForElement(elem: HTMLElement): {| x: number, y: number |} {
	const { left, right, top, bottom } = elem.getBoundingClientRect()
	return {
		x: left + Math.floor((right - left) / 2),
		y: top + Math.floor((bottom - top) / 2)
	}
}

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
