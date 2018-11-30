/* @flow strict */

import * as enzyme from "enzyme"
import * as React from "react"
import { type Labels } from "../../models/CustomLabel"
import * as clf from "../../models/CustomLabel.testFixtures"
import { Label, LabelProvider, WithLabels } from "./Label"

afterEach(() => {
	jest.resetAllMocks()
})

describe("Label", () => {
	it("renders translated text given a label name", () => {
		const wrapper = mount(<Label>Cancel_Editing</Label>)
		expect(wrapper).toHaveText("Cancel")
	})

	it("replaces token in label text with given strings", () => {
		const wrapper = mount(
			<Label
				with={{
					total: "6",
					current: "3"
				}}
			>
				Page_Number_With_Page_Count
			</Label>
		)
		expect(wrapper).toHaveText("Page 3 of 6")
	})

	it("renders React nodes given as substitutions", () => {
		const wrapper = mount(
			<Label with={{ subject: <em>Meeting</em> }}>Edit_Event</Label>
		)
		expect(wrapper).toContainReact(<em>Meeting</em>)
	})

	it("produces distinct `key` values even if token is repeated in text", () => {
		jest.spyOn(console, "error")
		const wrapper = mount(
			<Label with={{ token: <em>replacement</em> }}>label</Label>,
			{
				label: "{token}, {token}, {token}"
			}
		)
		expect(console.error).not.toHaveBeenCalled()
	})

	it("returns the label name if label text cannot be found", () => {
		jest.spyOn(console, "error").mockReturnValueOnce()
		const wrapper = mount(<Label>missing_label</Label>)
		expect(wrapper).toHaveText("missing_label")
		expect(console.error).toHaveBeenCalledWith(
			'Label not found, "missing_label"'
		)
	})

	it("leaves tokens intact if no replacement text is given", () => {
		const wrapper = mount(<Label>Text_With_Curly_Brackets</Label>, {
			Text_With_Curly_Brackets: "Refer to manual { 23, 7 }"
		})
		expect(wrapper).toHaveText("Refer to manual { 23, 7 }")
	})

	it("ignores whitespace around token identifier", () => {
		const wrapper = mount(
			<Label with={{ token: "replacement" }}>label</Label>,
			{
				label: "text { token }"
			}
		)
		expect(wrapper).toHaveText("text replacement")
	})
})

describe("WithLabels", () => {
	it("renders translated text given a label name", () => {
		const wrapper = mount(
			<WithLabels>{label => label("Cancel_Editing")}</WithLabels>
		)
		expect(wrapper).toHaveText("Cancel")
	})

	it("replaces token in label text with given strings", () => {
		const wrapper = mount(
			<WithLabels>
				{label =>
					label("Page_Number_With_Page_Count", { total: "6", current: "3" })
				}
			</WithLabels>
		)
		expect(wrapper).toHaveText("Page 3 of 6")
	})

	it("returns the label name if label text cannot be found", () => {
		jest.spyOn(console, "error").mockReturnValueOnce()
		const wrapper = mount(
			<WithLabels>{label => label("missing_label")}</WithLabels>
		)
		expect(wrapper).toHaveText("missing_label")
		expect(console.error).toHaveBeenCalledWith(
			'Label not found, "missing_label"'
		)
	})

	it("leaves tokens intact if no replacement text is given", () => {
		const wrapper = mount(
			<WithLabels>{label => label("Text_With_Curly_Brackets")}</WithLabels>,
			{
				Text_With_Curly_Brackets: "Refer to manual { 23, 7 }"
			}
		)
		expect(wrapper).toHaveText("Refer to manual { 23, 7 }")
	})

	it("ignores whitespace around token identifier", () => {
		const wrapper = mount(
			<WithLabels>
				{label => label("label", { token: "replacement" })}
			</WithLabels>,
			{
				label: "text { token }"
			}
		)
		expect(wrapper).toHaveText("text replacement")
	})
})

function mount(
	component: React.Node,
	labels: Labels = clf.labels
): enzyme.ReactWrapper {
	// The `div` wrapper suppresses a warning: "Failed prop type: Invalid prop
	// `Component` supplied to `WrapperComponent`"
	return enzyme.mount(
		<div>
			<LabelProvider value={labels}>{component}</LabelProvider>
		</div>
	)
}
