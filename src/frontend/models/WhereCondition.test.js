/* @flow strict */

import { stringifyCondition } from "./WhereCondition"

it("produces an empty string if no conditions are given", () => {
	const whereCondition = { conditions: [], conjunction: "and" }
	expect(stringifyCondition(whereCondition)).toBe("")
})

it("compares a value to a field", () => {
	const whereCondition = {
		field: "Name",
		operator: "like",
		values: ["'%foo%'"]
	}
	expect(stringifyCondition(whereCondition)).toBe("Name like '%foo%'")
})

it("translates operator names to symbols", () => {
	const whereCondition = {
		field: "CreatedDate",
		operator: "equals",
		values: ["THIS_WEEK"]
	}
	expect(stringifyCondition(whereCondition)).toBe("CreatedDate = THIS_WEEK")
})

it("negates a condition", () => {
	const whereCondition = {
		condition: {
			field: "CreatedDate",
			operator: "equals",
			values: ["THIS_WEEK"]
		}
	}
	expect(stringifyCondition(whereCondition)).toBe(
		"NOT (CreatedDate = THIS_WEEK)"
	)
})

it("combines multiple conditions with a conjunction", () => {
	const whereCondition = {
		conditions: [
			{ field: "Amount", operator: "notEquals", values: ["'1'"] },
			{ condition: { field: "Name", operator: "like", values: ["'%bar%'"] } },
			{
				conditions: [
					{ field: "Name", operator: "like", values: ["'%foo%'"] },
					{ field: "Name", operator: "like", values: ["'%baz%'"] }
				],
				conjunction: "or"
			}
		],
		conjunction: "and"
	}
	expect(stringifyCondition(whereCondition)).toBe(
		"(Amount != '1') and (NOT (Name like '%bar%')) and ((Name like '%foo%') or (Name like '%baz%'))"
	)
})
