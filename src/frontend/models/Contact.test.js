/* @flow strict */

import { failIfMissing } from "../testHelpers"
import { getId } from "./Contact"
import * as cf from "./Contact.testFixtures"

it("gets an ID for an contact", () => {
	const contact = failIfMissing(
		cf.contactQueryResult.records.find(c => c.Name === "Contact 1")
	)
	expect(getId(contact)).toBe("003f200001XrDt5AAF")
})
