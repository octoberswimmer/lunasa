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

export function getType(r: Record): string {
	return urlParts(r).type
}

export function getId(r: Record): string {
	return urlParts(r).id
}

const urlPattern = /sobjects\/(.*?)\/(.*)$/

function urlParts(r: Record): { type: string, id: string } {
	const matches = r.attributes.url.match(urlPattern)
	if (!matches) {
		throw new Error("Error determining type of referenced record")
	}
	return { type: matches[1], id: matches[2] }
}
