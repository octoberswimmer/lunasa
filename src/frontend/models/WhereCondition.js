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
		const nested = cond.conditions
			.map(c => stringifyCondition(c))
			.filter(c => !!c)
		if (nested.length < 1) {
			return ""
		}
		if (nested.length === 1) {
			return nested[0]
		}
		return nested.map(c => `(${c})`).join(` ${cond.conjunction} `)
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

export function conjunction(
	op: "and" | "or",
	conditions: WhereCondition[]
): WhereCondition {
	return { conjunction: op, conditions }
}

export function not(condition: WhereCondition): WhereCondition {
	return { condition }
}
