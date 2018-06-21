/* @flow strict */

import { type ListView, type ListViews, type Results } from "../models/ListView"
import {
	accountListViews,
	accountResults
} from "../models/ListView.testFixtures"

export async function fetchListViews(sobjectType: string): Promise<ListViews> {
	switch (sobjectType) {
		case "Account":
			return accountListViews
		default:
			throw new Error(`no fixtures for sobject type, ${sobjectType}`)
		
	}
}

export async function fetchResults(listView: ListView): Promise<Results> {
	return accountResults
}
