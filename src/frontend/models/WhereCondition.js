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
		return `${cond.field} ${operator} ${stringifyValues(cond.values)}`
	}
}

function stringifyValues(values: string[]): string {
	if (values.length === 0) {
		return ""
	} else if (values.length === 1) {
		return values[0]
	} else {
		return `(${values.join(", ")})`
	}
}
