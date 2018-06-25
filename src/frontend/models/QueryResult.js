/* @flow strict */

export type URL = string

export type Record = {
	[key: string]: any, // might be null
	attributes: {
		type: string, // e.g. "Account"
		url: URL
	}
}

export type QueryResult = {
	done: boolean,
	records: Record[],
	totalSize: number
}
