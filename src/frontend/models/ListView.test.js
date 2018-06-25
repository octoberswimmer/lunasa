/* @flow strict */

import { whereClause } from "./ListView"
import * as lf from "./ListView.testFixtures"

it("produces a where clause for a SOQL query", () => {
	const desc = lf.accountListViewDescriptions.find(
		d => d.id === "00Bf20000080l1o"
	)
	expect(desc).toBeDefined()
	if (desc) {
		expect(whereClause(desc)).toBe(
			"WHERE CreatedDate = THIS_WEEK "
		)
	}
})

it("includes scope clause for a SOQL query if scope is not 'everything'", () => {
	const origDesc = lf.accountListViewDescriptions.find(
		d => d.id === "00Bf20000080l1o"
	)
	expect(origDesc).toBeDefined()
	const desc = {
		...origDesc,
		scope: "mine"
	}
	expect(whereClause(desc)).toBe(
		"WHERE CreatedDate = THIS_WEEK USING SCOPE mine"
	)
})
