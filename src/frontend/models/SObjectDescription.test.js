/* @flow strict */

import * as ef from "./Event.testFixtures"
import {
	getDefaultValues,
	getReferenceFieldNames,
	getRelationshipName
} from "./SObjectDescription"

it("gets default values for comboboxes and picklists", () => {
	expect(getDefaultValues(ef.eventDescription, ef.eventCreateFieldSet)).toEqual(
		{
			ShowAs: "Busy",
			Subject: "Meeting"
		}
	)
})

it("gets a list of names of fields with the 'reference' type", () => {
	expect(getReferenceFieldNames(ef.eventDescription)).toEqual([
		"WhoId",
		"WhatId",
		"AccountId",
		"OwnerId",
		"CreatedById",
		"LastModifiedById",
		"RecurrenceActivityId"
	])
})

it("gets the name of a relationship given a reference field", () => {
	expect(getRelationshipName(ef.eventDescription, "WhatId")).toBe("What")
})
