/* @flow strict */

import { failIfMissing } from "../testHelpers"
import { fieldDefinitions } from "./FieldDefinition.testFixtures"
import { getFieldForSoql } from "./SortField"
import { sortFields } from "./SortField.testFixtures"

it("maps durable IDs in sort fields to qualified API names", () => {
	const sf = failIfMissing(
		sortFields.find(({ Id }) => Id === "m00f2000000kRjSAAU")
	)
	const field = getFieldForSoql(sf, fieldDefinitions)
	expect(field).toBe("Account.Name")
})

it("uses value in `Field__c` for `order by` if no mapping is required", () => {
	const sf = failIfMissing(
		sortFields.find(({ Id }) => Id === "m00f2000000kRjSAAX")
	)
	const field = getFieldForSoql(sf, fieldDefinitions)
	expect(field).toBe("Account.CreatedDate")
})
