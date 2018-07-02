/* @flow strict */

import * as enzyme from "enzyme"
import { Form, Formik } from "formik"
import moment from "moment"
import * as React from "react"
import ReactDateTime from "react-datetime"
import { delay } from "../../testHelpers"
import DateTime from "./DateTime"

const onSubmit = jest.fn()

afterEach(() => {
	onSubmit.mockClear()
})

it("connects a datetime input to a managed form", async () => {
	const start = moment.utc("2018-06-29T17:00Z")
	const wrapper = mount(<DateTime name="start" />)
	const input = wrapper.find(ReactDateTime)
	input.props().onChange(start)
	await submit(wrapper)
	expect(onSubmit).toHaveBeenCalledTimes(1)
	const values = onSubmit.mock.calls[0][0]
	expect(start.isSame(values.start)).toBe(true)
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
