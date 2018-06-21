/* @flow strict */

import { type ListView, type ListViews, type Results } from "../models/ListView"

const sessionToken = window.sessionToken
if (process.env.NODE_ENV === "production") {
	if (typeof sessionToken !== "string") {
		throw new Error("a session token is required")
	}
}

export async function fetchListViews(sobjectType: string): Promise<ListViews> {
	return request(`/services/data/v32.0/sobjects/${sobjectType}/listviews`)
}

export async function fetchResults(listView: ListView): Promise<Results> {
	return request(listView.resultsUrl)
}

async function request<T>(url: string): Promise<T> {
	const resp = await fetch(url, {
		headers: new Headers({
			Accept: "application/json",
			Authorization: `Bearer ${sessionToken}`
		})
	})
	return resp.json()
}
