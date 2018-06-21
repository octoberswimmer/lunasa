/* @flow strict */

import { mount } from "enzyme"
import * as React from "react"
import * as f from "../models/ListView.testFixtures"
import AccountCard from "./AccountCard"

it("displays name", () => {
	const record = f.accountResults.records[0]
	const name = record.columns.filter(c => c.fieldNameOrPath === "Name")[0].value
	const wrapper = mount(<AccountCard columns={record.columns} />)
	expect(wrapper.containsMatchingElement(n => n.text() === "Name")).toBe(true)
	expect(wrapper.containsMatchingElement(n => n.text() === name))
})
