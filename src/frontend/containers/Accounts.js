/*
 * A container is a class that holds client-side state, and exposes methods to
 * trigger state transitions. Multiple React components may subscribe to
 * the same container, ensuring that state is synchronized between components.
 *
 * See:
 * https://github.com/jamiebuilds/unstated/blob/master/README.md
 *
 * @flow strict
 */

import { Container } from "unstated"
import { type RestApi } from "../api/RestApi"
import { type Account } from "../models/Account"
import { type FieldSet, fieldList } from "../models/FieldSet"
import {
	type Id,
	type ListView,
	type ListViewDescription,
	type ListViews,
	whereClause
} from "../models/ListView"
import { type QueryResult } from "../models/QueryResult"
import {
	type AsyncActionState,
	asyncAction,
	asyncActionInitState,
	isLoading
} from "./asyncAction"

export type State = AsyncActionState & {
	accountFieldSet: FieldSet,
	accountQueryResult: QueryResult | null,
	listViewDescriptions: { [key: Id]: ListViewDescription },
	listViews: ListViews | null
}

export default class AccountContainer extends Container<State> {
	_restClient: Promise<RestApi>
	_lastRequested: ?ListView

	constructor(opts: {|
		accountFieldSet: FieldSet,
		restClient: Promise<RestApi>
	|}) {
		super()
		this._restClient = opts.restClient
		this.getListViews()
		this.state = {
			...asyncActionInitState,
			accountFieldSet: opts.accountFieldSet,
			accountQueryResult: null,
			listViewDescriptions: {},
			listViews: null
		}
	}

	getAccounts(): ?(Account[]) {
		const result = this.state.accountQueryResult
		if (result) {
			return result.records
		}
	}

	isLoading(): boolean {
		return isLoading(this)
	}

	async getListViews(): Promise<void> {
		await asyncAction(this, async () => {
			const client = await this._restClient
			const result = await client.fetchListViews("Account")
			const descriptions = await Promise.all(
				result.listviews.map(view => client.fetchListViewDescription(view))
			)
			const listViewDescriptions = {}
			for (const [index, listView] of result.listviews.entries()) {
				listViewDescriptions[listView.id] = descriptions[index]
			}
			await this.setState({ listViews: result, listViewDescriptions })
		})
	}

	async selectListView(listView: ListView): Promise<void> {
		this._lastRequested = listView
		await asyncAction(this, async () => {
			const accountQueryResult = await this._fetchAccountsByListView(listView)
			if (this._lastRequested === listView) {
				await this.setState({ accountQueryResult })
			}
		})
	}

	async _fetchAccountsByListView(listView: ListView): Promise<QueryResult> {
		const client = await this._restClient
		const desc = this.state.listViewDescriptions[listView.id]
		if (!desc) {
			throw new Error(
				"could not locate lookup criteria for the selected list view"
			)
		}
		const fields = fieldList(this.state.accountFieldSet)
		const where = whereClause(desc)
		const query = `SELECT ${fields} FROM Account ${where} ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST`
		return client.query(query)
	}
}
