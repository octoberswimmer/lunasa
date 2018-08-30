/* @flow strict */

import { type Layout } from "../models/Layout"
import {
	type ListView,
	type ListViewDescription,
	type ListViews
} from "../models/ListView"
import { type RecordTypeInfo } from "../models/RecordType"
import { type QueryResult } from "../models/QueryResult"
import productionConstructor from "./RestApi.production"

/*
 * `sobjectType` can be "Account"
 */
export interface RestApi {
	fetchLayout(recordType: RecordTypeInfo): Promise<Layout>;
	fetchListViews(sobjectType: string): Promise<ListViews>;
	fetchListViewDescription(listView: ListView): Promise<ListViewDescription>;
	query(soqlQuery: string): Promise<QueryResult>;
}

// Load mock API module in development, production module in production. This is
// written using the `import` statement so that the development module is not
// included in the combined js file that is deployed to production. The
// production module is imported in a line at the top of the file so that it
// *is* included in the combined file - otherwise Webpack would split the
// combined js into two files.
//
// When Webpack encounters the condition `process.env.NODE_ENV === "production"`
// in non-async code it will inline the branch where that condition is true when
// building the production bundle. Webpack will remove the condition and the
// `else` branch.
export default function RestApiConstructor(
	sessionToken: string
): Promise<RestApi> {
	if (process.env.NODE_ENV === "production") {
		return Promise.resolve(productionConstructor(sessionToken))
	} else {
		return import("./RestApi.development.js").then(module => module.default())
	}
}
