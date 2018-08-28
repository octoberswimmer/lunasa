/* @flow strict */

import {
	type ListView,
	type ListViewDescription,
	type ListViews
} from "../models/ListView"
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

	function fetchListViewDescription(
		listView: ListView
	): Promise<ListViewDescription> {
		return request(sessionToken, listView.describeUrl)
	}

	function query(soqlQuery: string): Promise<QueryResult> {
		const q = encodeURIComponent(soqlQuery)
		return request(sessionToken, `/services/data/v40.0/query?q=${q}`)
	}

	return { fetchListViews, fetchListViewDescription, query }
}
