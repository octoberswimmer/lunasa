/* @flow strict */

import * as enzyme from "enzyme"
import * as React from "react"
import { DragDropContext } from "react-dnd"
import TestBackend from "react-dnd-test-backend"
import * as f from "../models/Account.testFixtures"
import AccountCard from "./AccountCard"
import Draggable from "./Draggable"

const record = {
	attributes: { type: "test", url: "test" },
	CreatedDate: "2018-06-01T20:35:50.000+0000",
	Name: "Test Account",
	Phone: "(520) 773-9050",
	Site: null
}

const fieldSet = [
	{ name: "Name", label: "Account Name", type: "string" },
	{ name: "Site", label: "Account Site", type: "string" },
	{ name: "CreatedDate", label: "Created Date", type: "datetime" },
	{ name: "Phone", label: "Account Phone", type: "phone" }
]

it("displays fields", () => {
	const wrapper = mount(<AccountCard fieldSet={fieldSet} record={record} />)
	expect(wrapper.text()).toMatch("Test Account")
	expect(wrapper.text()).toMatch("Site-")
	expect(wrapper.text()).toMatch(/Created Date[0-9/]+/)
	expect(wrapper.text()).toMatch("Phone(520) 773-9050")
})

it("formats dates according to the user's locale", () => {
	const wrapper = mount(<AccountCard fieldSet={fieldSet} record={record} />)
	const match = wrapper.text().match(/Created Date([0-9/]+)/)
	if (!match) {
		throw new Error("match failed")
	}
	const output = match[1]
	expect(output).toMatch(/06\/01\/2018|01\/06\/2018/)
})

it("renders an image when given an image tag", () => {
	const wrapper = mount(
		<AccountCard
			fieldSet={fieldSet}
			record={{
				...record,
				Site:
					"<img src='/public/image.png' alt='an image' style='width:20px' />"
			}}
		/>
	)
	expect(wrapper).toContainReact(
		<img src="/public/image.png" alt="an image" style={{ width: "20px" }} />
	)
})

it("identifies an account by URL when dragging", () => {
	const wrapper = mount(<AccountCard fieldSet={fieldSet} record={record} />)
	const draggable = wrapper.find(Draggable)
	expect(draggable.props()).toHaveProperty("item", {
		type: "Account",
		url: record.attributes.url
	})
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
