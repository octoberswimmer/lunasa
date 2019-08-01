/* @flow strict */

import { Form, Formik } from "formik"
import * as enzyme from "enzyme"
import * as React from "react"
import { delay } from "../../testHelpers"
import Combobox from "./Combobox"

const fruits = [
	{ value: "apple", label: "Apple", active: true, defaultValue: false },
	{ value: "banana", label: "Banana", active: true, defaultValue: false },
	{ value: "cranberry", label: "Cranberry", active: true, defaultValue: false }
]

const onSubmit = jest.fn()

afterEach(() => {
	onSubmit.mockClear()
})

it("passes initial value to input", async () => {
	const wrapper = mount(
		<Combobox label="Fruit" name="fruit" options={fruits} />,
		{ initialValues: { fruit: "cranberry" } }
	)
	const input = wrapper.find("input.slds-combobox__input")
	input.simulate("change")
	await submit(wrapper)
	expect(onSubmit).toHaveBeenCalledWith(
		expect.objectContaining({
			fruit: "cranberry"
		}),
		expect.anything()
	)
})

it("captures user input", async () => {
	const wrapper = mount(
		<Combobox label="Fruit" name="fruit" options={fruits} />
	)
	const input = wrapper.find("input.slds-combobox__input")
	inputElement(input).value = "banana"
	input.simulate("change")
	await submit(wrapper)
	expect(onSubmit).toHaveBeenCalledWith(
		expect.objectContaining({
			fruit: "banana"
		}),
		expect.anything()
	)
})

it("accepts values not included in the given suggestion list", async () => {
	const wrapper = mount(
		<Combobox label="Fruit" name="fruit" options={fruits} />
	)
	const input = wrapper.find("input.slds-combobox__input")
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
		<Combobox label="Fruit" name="fruit" options={fruits} />
	)
	const input = wrapper.find("input.slds-combobox__input")
	const label = wrapper.find("label")
	expect(label.props().htmlFor).toBeTruthy()
	expect(label.props().htmlFor).toBe(input.props().id)
	expect(label.text()).toMatch("Fruit")
})

it("displays completions", () => {
	const wrapper = mount(
		<Combobox label="Fruit" name="fruit" options={fruits} />
	)
	const input = wrapper.find("input.slds-combobox__input")
	inputElement(input).value = "A"
	input.simulate("change")
	const completions = wrapper.find("li")
	expect(completions.map(n => n.text())).toEqual(fruits.map(f => f.label))
})

it("displays completions when input is empty", () => {
	const wrapper = mount(
		<Combobox label="Fruit" name="fruit" options={fruits} />
	)
	const input = wrapper.find("input.slds-combobox__input")
	expect(inputElement(input).value).toBe("")
	input.simulate("click")
	const completions = wrapper.find("li")
	expect(completions.map(n => n.text())).toEqual(fruits.map(f => f.label))
})

it("displays all completions if the input value has not been edited", () => {
	// If the input value is untouched then display all available completions.
	// This makes it easy to switch to another option if the combobox is
	// populated with a default value.
	const wrapper = mount(
		<Combobox label="Fruit" name="fruit" options={fruits} />,
		{ initialValues: { fruit: "apple" } }
	)
	const input = wrapper.find("input.slds-combobox__input")
	expect(inputElement(input).value).toBe("apple")
	input.simulate("click")
	const completions = wrapper.find("li")
	expect(completions.map(n => n.text())).toEqual(fruits.map(f => f.label))

	// Change form state to so that input has been "touched"
	inputElement(input).value = "appl"
	input.simulate("change")
	expect(wrapper.find("li").map(n => n.text())).toEqual(["Apple"])
})

it("updates form state when a completion is clicked", async () => {
	const wrapper = mount(
		<Combobox label="Fruit" name="fruit" options={fruits} />
	)
	const input = wrapper.find("input.slds-combobox__input")
	inputElement(input).value = "a"
	input.simulate("change")
	const completion = wrapper
		.find(".slds-listbox__option-text")
		.filterWhere(n => n.text() === "Banana")
	completion.simulate("click")
	await submit(wrapper)
	wrapper.update()
	expect(onSubmit).toHaveBeenCalledWith(
		{
			fruit: "Banana"
		},
		expect.anything()
	)
})

it("hides completions dropdown when there are no completions to display", async () => {
	const wrapper = mount(
		<Combobox label="Fruit" name="fruit" options={fruits} />
	)
	const input = wrapper.find("input.slds-combobox__input")
	inputElement(input).value = "not a fruit"
	input.simulate("change")
	const dropdown = wrapper.find("ul")
	expect(dropdown).not.toExist()
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
