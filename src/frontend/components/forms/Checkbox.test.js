/* @flow strict */

import * as enzyme from "enzyme"
import { Form, Formik } from "formik"
import * as React from "react"
import { delay, inputElement } from "../../testHelpers"
import Checkbox from "./Checkbox"

const onSubmit = jest.fn()

afterEach(() => {
	onSubmit.mockClear()
})

it("displays a checkbox with a label", () => {
	const wrapper = mount(<Checkbox name="IsGood" label="Is Good" />)
	const input = wrapper.find("input")
	expect(wrapper.text()).toBe("Is Good")
	expect(input.props()).toMatchObject({
		name: "IsGood",
		type: "checkbox"
	})
})

it("is not checked if no value has been provided", () => {
	const wrapper = mount(<Checkbox name="IsGood" label="Is Good" />)
	const input = wrapper.find("input")
	expect(input.props()).toHaveProperty("checked", false)
})

it("is checked if its initial value is set to `true`", () => {
	const wrapper = mount(<Checkbox name="IsGood" label="Is Good" />, {
		initialValues: { IsGood: true }
	})
	const input = wrapper.find("input")
	expect(input.props()).toHaveProperty("checked", true)
})

it("produces a boolean value on submit", async () => {
	const wrapper = mount(<Checkbox name="IsGood" label="Is Good" />)
	const input = wrapper.find("input")
	expect(wrapper.text()).toBe("Is Good")
	expect(input.props()).toMatchObject({
		name: "IsGood",
		type: "checkbox"
	})
	inputElement(input).checked = true
	input.simulate("change")
	await submit(wrapper)
	expect(onSubmit).toHaveBeenCalledWith(
		{
			IsGood: true
		},
		expect.anything()
	)
})

it("displays an error", () => {
	const wrapper = mount(<Checkbox name="IsGood" label="Is Good" />)
	const form = wrapper.find(Formik)
	form.instance().setFieldError("IsGood", "Please anwser 'yes' or 'no'.")
	expect(wrapper.text()).toMatch("Please anwser 'yes' or 'no'.")
})

function mount(
	component: React.Node,
	formikProps: Object = {}
): enzyme.ReactWrapper {
	return enzyme.mount(
		<Formik
			{...formikProps}
			onSubmit={onSubmit}
			render={() => <Form>{component}</Form>}
		/>
	)
}

async function submit(wrapper: enzyme.ReactWrapper) {
	const form = wrapper.find("form")
	form.props().onSubmit()
	await delay()
}
