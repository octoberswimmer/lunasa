/* @flow strict */

import Button from "@salesforce/design-system-react/components/button"
import * as enzyme from "enzyme"
import * as React from "react"
import * as clf from "../../models/CustomLabel.testFixtures"
import * as F from "../../models/Filter"
import { LabelProvider } from "../i18n/Label"
import FilterByFirstLetter from "./FilterByFirstLetter"

it("displays a list of Latin letters", () => {
	const wrapper = mount(
		<FilterByFirstLetter filters={[]} locale="en-US" onApplyFilter={noop} />
	)
	expect(wrapper.text()).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZOtherAll")
})

it("filters by a letter when it is clicked", () => {
	const onApplyFilter = jest.fn()
	const wrapper = mount(
		<FilterByFirstLetter
			filters={[]}
			locale="en-US"
			onApplyFilter={onApplyFilter}
		/>
	)
	const button = wrapper.find(Button).filterWhere(n => n.text() === "B")
	button.simulate("click")
	expect(onApplyFilter).toBeCalled()
	expect(F.filterByLetter([onApplyFilter.mock.calls[0][0]])).toBe("b")
})

it("filters by 'Other'", () => {
	const onApplyFilter = jest.fn()
	const wrapper = mount(
		<FilterByFirstLetter
			filters={[]}
			locale="en-US"
			onApplyFilter={onApplyFilter}
		/>
	)
	const button = wrapper.find(Button).filterWhere(n => n.text() === "Other")
	button.simulate("click")
	expect(onApplyFilter).toBeCalled()
	expect(F.filterByLetterOther([onApplyFilter.mock.calls[0][0]])).toBe(true)
})

it("filters by 'All'", () => {
	const onApplyFilter = jest.fn()
	const wrapper = mount(
		<FilterByFirstLetter
			filters={[]}
			locale="en-US"
			onApplyFilter={onApplyFilter}
		/>
	)
	const button = wrapper.find(Button).filterWhere(n => n.text() === "All")
	button.simulate("click")
	expect(onApplyFilter).toBeCalled()
	expect(F.filterByLetterAny([onApplyFilter.mock.calls[0][0]])).toBe(true)
})

it("highlights a letter when the corresponding filter is active", () => {
	const wrapper = mount(
		<FilterByFirstLetter
			filters={[F.firstLetter("b")]}
			locale="en-US"
			onApplyFilter={noop}
		/>
	)
	const button = wrapper.find(Button).filterWhere(n => n.text() === "B")
	expect(button).toHaveClassName("selected")
})

it("highlights 'Other' when the corresponding filter is active", () => {
	const wrapper = mount(
		<FilterByFirstLetter
			filters={[F.firstLetterOther()]}
			locale="en-US"
			onApplyFilter={noop}
		/>
	)
	const button = wrapper.find(Button).filterWhere(n => n.text() === "Other")
	expect(button).toHaveClassName("selected")
})

it("highlights 'All' when the corresponding filter is active", () => {
	const wrapper = mount(
		<FilterByFirstLetter
			filters={[F.firstLetterAny()]}
			locale="en-US"
			onApplyFilter={noop}
		/>
	)
	const button = wrapper.find(Button).filterWhere(n => n.text() === "All")
	expect(button).toHaveClassName("selected")
})

function noop() {}

// Unmount React tree after each test to avoid errors about missing `document`,
// and to avoid slowdown from accumulated React trees.
let _wrapper: enzyme.ReactWrapper
afterEach(() => {
	if (_wrapper) {
		_wrapper.unmount()
	}
})

// Helper that wraps component with a label provider
function mount(component: React.Node): enzyme.ReactWrapper {
	// The outer `div` avoids a prop type error.
	_wrapper = enzyme.mount(
		<div>
			<LabelProvider value={clf.labels}>{component}</LabelProvider>
		</div>
	)
	return _wrapper
}
