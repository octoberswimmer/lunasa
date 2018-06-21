/* @flow strict */

import { type ListView, type ListViews, type Results } from "../models/ListView"
import * as listViewsClient from "./ListViews.production"

/*
 * `sobjectType` can be "Account"
 */
export interface ListViewsApi {
	fetchListViews(sobjectType: string): Promise<ListViews>;
	fetchResults(listView: ListView): Promise<Results>;
}

const ListViewsClient: Promise<ListViewsApi> =
	process.env.NODE_ENV !== "production"
		? import("./ListViews.development.js")
		: Promise.resolve(listViewsClient)

export default ListViewsClient
