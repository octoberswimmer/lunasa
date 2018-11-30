import * as enzyme from "enzyme"
import * as React from "react"
import * as clf from "../../models/CustomLabel.testFixtures"
import * as F from "../../models/Filter"
import { delay, inputElement } from "../../testHelpers"
import { LabelProvider } from "../i18n/Label"
import Search from "./Search"

const debounceInterval = 5

it("filters by the given substring", async () => {
	const onApplyFilter = jest.fn()
	const wrapper = mount(
		<Search
			debounceInterval={debounceInterval}
			filters={[]}
			onApplyFilter={onApplyFilter}
		/>
	)
	const input = wrapper.find("input[name='search']")
	inputElement(input).value = "Juice"
	input.simulate("change")
	await delay(debounceInterval * 2)
	expect(onApplyFilter).toHaveBeenCalledWith(
		expect.objectContaining(F.substring("Juice"))
	)
})

it("limits filter updates to one update per debounce interval", async () => {
	const onApplyFilter = jest.fn()
	const wrapper = mount(
		<Search
			debounceInterval={debounceInterval}
			filters={[]}
			onApplyFilter={onApplyFilter}
		/>
	)
	const input = wrapper.find("input[name='search']")
	inputElement(input).value = "Juice"

	input.simulate("change")
	await delay()
	input.simulate("change")
	await delay()
	input.simulate("change")

	await delay(debounceInterval * 2)
	input.simulate("change")

	await delay(debounceInterval * 2)
	expect(onApplyFilter).toHaveBeenCalledTimes(2)
})

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
