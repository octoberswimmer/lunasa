/* @flow strict */

import { type Layout } from "../models/Layout"
import {
	type ListView,
	type ListViewDescription,
	type ListViews
} from "../models/ListView"
import { type RecordTypeInfo } from "../models/RecordType"
import { type QueryResult } from "../models/QueryResult"
import * as af from "../models/Account.testFixtures"
import * as cf from "../models/Contact.testFixtures"
import * as ef from "../models/Event.testFixtures"
import * as lf from "../models/ListView.testFixtures"

export default function ListViewsApi() {
	async function fetchLayout(recordType: RecordTypeInfo): Promise<Layout> {
		return ef.eventLayouts[recordType.urls.layout]
	}

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
		if(soqlQuery.includes('FROM Account')) {
			return af.accountQueryResult
		} else {
			return cf.contactQueryResult
		}
		
	}

	return { fetchLayout, fetchListViews, fetchListViewDescription, query }
}
