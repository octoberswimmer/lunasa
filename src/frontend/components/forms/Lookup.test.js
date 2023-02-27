import React from "react"
import { Form, Formik } from "formik"
import * as enzyme from "enzyme"
import SalesforceLookup from "./Lookup"

const onSubmit = jest.fn()

afterEach(() => {
	onSubmit.mockClear()
})

describe("SalesforceLookup component", () => {
	const options = [
		{ id: "1", value: "1", label: "Option 1" },
		{ id: "2", value: "2", label: "Option 2" },
		{ id: "3", value: "3", label: "Option 3" }
	]
	const props = {
		name: "lookup",
		label: "Lookup",
		placeholder: "Search",
		options: options,
		value: null
	}

	it("renders without crashing", () => {
		const wrapper = mount(
			<SalesforceLookup label="Test Lookup" options={options} />
		)
		expect(wrapper.exists()).toBe(true)
	})

	it("should render a SLDSLookup component with correct props", () => {
		const wrapper = mount(<SalesforceLookup {...props} />)
		//shallow(<SalesforceLookup {...props} />)
		expect(wrapper.find("SLDSLookup").prop("label")).toEqual(props.label)
		expect(wrapper.find("SLDSLookup").prop("placeholder")).toEqual(
			props.placeholder
		)
		expect(wrapper.find("SLDSLookup").prop("options")).toEqual(props.options)
		expect(wrapper.find("SLDSLookup").prop("value")).toEqual(props.value)
	})
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
