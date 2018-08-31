/* @flow strict */

import { type Layout } from "../models/Layout"
import {
	type ListView,
	type ListViewDescription,
	type ListViews
} from "../models/ListView"
import { type RecordTypeInfo } from "../models/RecordType"
import { type QueryResult } from "../models/QueryResult"

async function request<T>(sessionToken: string, url: string): Promise<T> {
	const resp = await fetch(url, {
		headers: new Headers({
			Accept: "application/json",
			Authorization: `Bearer ${sessionToken}`
		})
	})
	const data = await resp.json()
	if (data && data.errorCode) {
		throw new Error(data.message || data.errorCode)
	}
	return data
}

export default function ListViewsApi(sessionToken: string) {
	function fetchListViews(sobjectType: string): Promise<ListViews> {
		return request(
			sessionToken,
			`/services/data/v32.0/sobjects/${sobjectType}/listviews`
		)
	}

	function fetchLayout(recordType: RecordTypeInfo): Promise<Layout> {
		return request(sessionToken, recordType.urls.layout)
	}

	function fetchListViewDescription(
		listView: ListView
	): Promise<ListViewDescription> {
		return request(sessionToken, listView.describeUrl)
	}

	function query(soqlQuery: string): Promise<QueryResult> {
		const q = encodeURIComponent(soqlQuery)
		return request(sessionToken, `/services/data/v40.0/query?q=${q}`)
	}

	return { fetchLayout, fetchListViews, fetchListViewDescription, query }
}
