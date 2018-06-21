/* @flow strict */

type Id = string
type URL = string

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

export type Record = {
	columns: Array<{ fieldNameOrPath: string, value: string | null }>
}

export type Results = {
	columns: Column[],
	developerName: string,
	done: boolean,
	id: Id,
	label: string,
	records: Record[],
	size: number
}
