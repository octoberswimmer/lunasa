/* @flow strict */

import { stringifyCondition } from "./WhereCondition"

it("produces an empty string if no conditions are given", () => {
	const whereCondition = { conditions: [], conjunction: "AND" }
	expect(stringifyCondition(whereCondition)).toBe("")
})

it("skips nested conjunction conditions with empty sub-condition lists", () => {
	const nested = [
		{ conditions: [], conjunction: "AND" },
		{ field: "Name", operator: "notEquals", values: ["'bob'"] }
	]
	const whereCondition = { conditions: nested, conjunction: "AND" }
	expect(stringifyCondition(whereCondition)).toBe("Name != 'bob'")
})

it("formats single condition of a conjunction without parenthesis", () => {
	const nested = [{ field: "Name", operator: "notEquals", values: ["'bob'"] }]
	const whereCondition = { conditions: nested, conjunction: "AND" }
	expect(stringifyCondition(whereCondition)).toBe("Name != 'bob'")
})

it("compares a value to a field", () => {
	const whereCondition = {
		field: "Name",
		operator: "LIKE",
		values: ["'%foo%'"]
	}
	expect(stringifyCondition(whereCondition)).toBe("Name LIKE '%foo%'")
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
			{ condition: { field: "Name", operator: "LIKE", values: ["'%bar%'"] } },
			{
				conditions: [
					{ field: "Name", operator: "LIKE", values: ["'%foo%'"] },
					{ field: "Name", operator: "LIKE", values: ["'%baz%'"] }
				],
				conjunction: "OR"
			}
		],
		conjunction: "AND"
	}
	expect(stringifyCondition(whereCondition)).toBe(
		"(Amount != '1') AND (NOT (Name LIKE '%bar%')) AND ((Name LIKE '%foo%') OR (Name LIKE '%baz%'))"
	)
})

it("outputs arguments to `IN` as a list", () => {
	expect(
		stringifyCondition({
			field: "Id",
			operator: "IN",
			values: ["'001f200001XrDsxAAF'", "'001f200001XrDsyAAF'"]
		})
	).toBe("Id IN ('001f200001XrDsxAAF', '001f200001XrDsyAAF')")
	expect(
		stringifyCondition({
			field: "Id",
			operator: "IN",
			values: ["'001f200001XrDsxAAF'"]
		})
	).toBe("Id IN ('001f200001XrDsxAAF')")
	expect(
		stringifyCondition({
			field: "Id",
			operator: "IN",
			values: []
		})
	).toBe("Id IN ()")
})
