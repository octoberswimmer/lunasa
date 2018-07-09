/* @flow strict */

export type WhereCondition =
	| {| conjunction: "and" | "or", conditions: WhereCondition[] |}
	| {| field: string, operator: string, values: string[] |}
	| {| condition: WhereCondition |} // negation

const operatorMap = {
	equals: "=",
	notEquals: "!=",
	greaterThan: ">",
	greaterThanOrEqualTo: ">=",
	lessThan: "<",
	lessThanOrEqualTo: "<="
}

// operators that require an argument in the form of a list
const listOperators = ["in"]

export function stringifyCondition(cond: WhereCondition): string {
	if (cond.conditions) {
		if (cond.conditions.length < 1) {
			return ""
		}
		return cond.conditions
			.map(c => `(${stringifyCondition(c)})`)
			.join(` ${cond.conjunction} `)
	} else if (cond.condition) {
		return `NOT (${stringifyCondition(cond.condition)})`
	} else {
		const operator = operatorMap[cond.operator] || cond.operator
		return `${cond.field} ${operator} ${stringifyValues(operator, cond.values)}`
	}
}

function stringifyValues(operator: string, values: string[]): string {
	if (values.length > 1 || listOperators.includes(operator.toLowerCase())) {
		return `(${values.join(", ")})`
	} else if (values.length === 0) {
		return ""
	} else {
		return values[0]
	}
}
