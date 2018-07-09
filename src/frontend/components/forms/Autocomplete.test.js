/* @flow strict */

import { Form, Formik } from "formik"
import * as enzyme from "enzyme"
import * as React from "react"
import { delay } from "../../testHelpers"
import Autocomplete from "./Autocomplete"

const fruits = ["apple", "banana", "cranberry"]

const onSubmit = jest.fn()

afterEach(() => {
	onSubmit.mockClear()
})

it("passes initial value to input", async () => {
	const wrapper = mount(
		<Autocomplete label="Fruit" name="fruit" suggestions={fruits} />,
		{ initialValues: { fruit: "cranberry" } }
	)
	const input = wrapper.find("input[name='fruit']")
	input.simulate("change")
	await submit(wrapper)
	expect(onSubmit).toHaveBeenCalledWith(
		{
			fruit: "cranberry"
		},
		expect.anything()
	)
})

it("captures user input", async () => {
	const wrapper = mount(
		<Autocomplete label="Fruit" name="fruit" suggestions={fruits} />
	)
	const input = wrapper.find("input[name='fruit']")
	inputElement(input).value = "banana"
	input.simulate("change")
	await submit(wrapper)
	expect(onSubmit).toHaveBeenCalledWith(
		{
			fruit: "banana"
		},
		expect.anything()
	)
})

it("accepts values not included in the given suggestion list", async () => {
	const wrapper = mount(
		<Autocomplete label="Fruit" name="fruit" suggestions={fruits} />
	)
	const input = wrapper.find("input[name='fruit']")
	inputElement(input).value = "date"
	input.simulate("change")
	await submit(wrapper)
	expect(onSubmit).toHaveBeenCalledWith(
		{
			fruit: "date"
		},
		expect.anything()
	)
})

it("displays a label", () => {
	const wrapper = mount(
		<Autocomplete label="Fruit" name="fruit" suggestions={fruits} />
	)
	const input = wrapper.find("input[name='fruit']")
	const label = wrapper.find("label")
	expect(label.props().htmlFor).toBeTruthy()
	expect(label.props().htmlFor).toBe(input.props().id)
	expect(label.text()).toMatch("Fruit")
})

it("displays completions", () => {
	const wrapper = mount(
		<Autocomplete label="Fruit" name="fruit" suggestions={fruits} />
	)
	const input = wrapper.find("input[name='fruit']")
	inputElement(input).value = "a"
	input.simulate("change")
	const completions = wrapper.find("li")
	expect(completions.map(n => n.text())).toEqual(fruits)
})

it("displays completions when input is empty", () => {
	const wrapper = mount(
		<Autocomplete label="Fruit" name="fruit" suggestions={fruits} />
	)
	const input = wrapper.find("input[name='fruit']")
	expect(inputElement(input).value).toBe("")
	input.simulate("focus")
	const completions = wrapper.find("li")
	expect(completions.map(n => n.text())).toEqual(fruits)
})

it("updates form state when a completion is clicked", async () => {
	const wrapper = mount(
		<Autocomplete label="Fruit" name="fruit" suggestions={fruits} />
	)
	const input = wrapper.find("input[name='fruit']")
	inputElement(input).value = "a"
	input.simulate("change")
	const completion = wrapper.find("li").filterWhere(n => n.text() === "banana")
	completion.simulate("click")
	await submit(wrapper)
	wrapper.update()
	expect(onSubmit).toHaveBeenCalledWith(
		{
			fruit: "banana"
		},
		expect.anything()
	)
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

function inputElement(wrapper: enzyme.ReactWrapper): HTMLInputElement {
	return (wrapper: any).getDOMNode()
}
