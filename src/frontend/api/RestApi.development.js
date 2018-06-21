/* @flow strict */

import {
	type ListView,
	type ListViewDescription,
	type ListViews
} from "../models/ListView"
import { type QueryResult } from "../models/QueryResult"
import * as af from "../models/Account.testFixtures"
import * as lf from "../models/ListView.testFixtures"

export default function ListViewsApi() {
	async function fetchListViews(sobjectType: string): Promise<ListViews> {
		switch (sobjectType) {
			case "Account":
				return lf.accountListViews
			default:
				throw new Error(`no fixtures for sobject type, ${sobjectType}`)
		}
	}

	async function fetchListViewDescription(
		listView: ListView
	): Promise<ListViewDescription> {
		const idx = lf.accountListViews.listviews.findIndex(
			v => v.id === listView.id
		)
		return lf.accountListViewDescriptions[idx]
	}

	async function query(soqlQuery: string): Promise<QueryResult> {
		return af.accountQueryResult
	}

	return { fetchListViews, fetchListViewDescription, query }
}
