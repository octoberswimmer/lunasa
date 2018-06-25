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
	listViews: ListViews | null,
	count: number | null,
	offset: number,
	pageSize: number
}

type Request = { listView: ListView, limit: number, offset: number }

export default class AccountContainer extends Container<State> {
	_restClient: Promise<RestApi>
	_lastRequest: ?Request

	constructor(opts: {|
		accountFieldSet: FieldSet,
		pageSize?: number,
		restClient: Promise<RestApi>
	|}) {
		super()
		this._restClient = opts.restClient
		this.fetchListViews()
		this.state = {
			...asyncActionInitState,
			accountFieldSet: opts.accountFieldSet,
			accountQueryResult: null,
			listViewDescriptions: {},
			listViews: null,
			count: null,
			offset: 0,
			pageSize: opts.pageSize || 5
		}
	}

	getAccounts(): ?(Account[]) {
		const result = this.state.accountQueryResult
		if (result) {
			return result.records
		}
	}

	currentPageNumber(): number {
		return Math.floor(this.state.offset / this.state.pageSize) + 1
	}

	pageCount(): ?number {
		if (this.state.count) {
			return Math.ceil(this.state.count / this.state.pageSize)
		}
	}

	isLoading(): boolean {
		return isLoading(this)
	}

	async fetchListViews(): Promise<void> {
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
		const request = { listView, limit: this.state.pageSize, offset: 0 }
		await Promise.all([
			this._fetchAccounts(request),
			this._fetchRecordCount(request)
		])
	}

	async fetchPage(pageNumber: number): Promise<void> {
		const lastRequest = this._lastRequest
		if (!lastRequest) {
			throw new Error("cannot fetch a page before a list view is selected")
		}
		const pageSize = this.state.pageSize
		const offset = (pageNumber - 1) * pageSize // page numbers start at 1
		const listView = lastRequest.listView
		const request = { listView, limit: pageSize, offset }
		return this._fetchAccounts(request)
	}

	async _fetchAccounts(request: Request): Promise<void> {
		this._lastRequest = request
		await asyncAction(this, async () => {
			const accountQueryResult = await this._queryAccounts(request)
			// Make sure that the result from a long-running query does not
			// replace data from a more-recent, faster query.
			if (this._lastRequest === request) {
				await this.setState({ accountQueryResult, offset: request.offset })
			}
		})
	}

	async _queryAccounts({
		listView,
		limit,
		offset
	}: Request): Promise<QueryResult> {
		const client = await this._restClient
		const fields = fieldList(this.state.accountFieldSet)
		const where = whereClause(this._getDescription(listView))
		const query = `SELECT ${fields} FROM Account ${where} ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST LIMIT ${limit} OFFSET ${offset}`
		return client.query(query)
	}

	async _fetchRecordCount({ listView }: Request): Promise<void> {
		await asyncAction(this, async () => {
			const client = await this._restClient
			const where = whereClause(this._getDescription(listView))
			const query = `SELECT COUNT() FROM Account ${where}`
			const result = await client.query(query)
			await this.setState({ count: result.totalSize })
		})
	}

	_getDescription(listView: ListView): ListViewDescription {
		const desc = this.state.listViewDescriptions[listView.id]
		if (!desc) {
			throw new Error(
				"could not locate lookup criteria for the selected list view"
			)
		}
		return desc
	}
}
