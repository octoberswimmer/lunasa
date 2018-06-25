/* @flow strict */

import { type WhereCondition, stringifyCondition } from "./WhereCondition"

export type Id = string
export type URL = string

export type ListView = {
	describeUrl: URL,
	developerName: string,
	id: Id,
	label: string,
	resultsUrl: URL,
	soqlCompatible: boolean,
	url: URL
}

// Shape of data served by the Salesforce REST API when requesting a list of
// list views.
export type ListViews = {
	done: boolean,
	listviews: ListView[],
	nextRecordsUrl: URL | null,
	size: number,
	sobjectType: string
}

export type ResultType =
	| "datetime"
	| "id"
	| "phone"
	| "picklist"
	| "reference"
	| "string"

export type Column = {
	ascendingLabel: string | null, // "Z-A"
	descendingLabel: string | null, // "A-Z"
	fieldNameOrPath: string,
	hidden: boolean,
	label: string,
	selectListItem: string,
	sortDirection: "ascending" | "descending" | null,
	sortIndex: number | null,
	sortable: boolean,
	type: ResultType
}

export type ListViewDescription = {
	columns: Column[],
	id: Id,
	orderBy: Array<{
		fieldNameOrPath: string,
		nullsPosition: string,
		sortDirection: "ascending" | "descending"
	}>,
	query: string, // SOQL query
	scope: string, // e.g. "everything"
	sobjectType: string, // e.g. "Account"
	whereCondition: WhereCondition
}

/*
 * Read `whereCondition` and `scope` from a list view description and produce
 * a string for use in a SOQL query.
 */
export function whereClause(desc: ListViewDescription): string {
	const cond = stringifyCondition(desc.whereCondition)
	const where = cond ? `WHERE ${cond}` : ""
	const scope =
		desc.scope && desc.scope !== "everything" ? `USING SCOPE ${desc.scope}` : ""
	return [where, scope].join(" ")
}
