/* @flow strict */

import { failIfMissing } from "../testHelpers"
import { getId } from "./Account"
import * as af from "./Account.testFixtures"

it("gets an ID for an account", () => {
	const account = failIfMissing(
		af.accountQueryResult.records.find(a => a.Name === "GenePoint")
	)
	expect(getId(account)).toBe("001f200001XrDt5AAF")
})
