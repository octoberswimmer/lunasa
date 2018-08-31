/* @flow strict */

import * as ef from "./Event.testFixtures"
import { getDefaultValues, getPicklistValues } from "./Layout"

it("gets picklist values", () => {
	expect(
		getPicklistValues(ef.eventDescription, ef.offsiteEventLayout, "Subject")
	).toEqual([
		{
			active: true,
			defaultValue: true,
			label: "Call",
			validFor: null,
			value: "Call"
		},
		{
			active: true,
			defaultValue: false,
			label: "Email",
			validFor: null,
			value: "Email"
		},
		{
			active: true,
			defaultValue: false,
			label: "Send Letter/Quote",
			validFor: null,
			value: "Send Letter/Quote"
		}
	])
})

it("gets default values for comboboxes and picklists", () => {
	expect(
		getDefaultValues(
			ef.eventDescription,
			ef.eventLayout,
			ef.eventCreateFieldSet
		)
	).toEqual({
		ShowAs: "Busy",
		Subject: "Meeting"
	})
})
