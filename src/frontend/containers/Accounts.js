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

import sortBy from "lodash.sortby"
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
import * as SortField from "../models/SortField"
import { stringifyCondition } from "../models/WhereCondition"
import {
	type AsyncActionState,
	asyncAction,
	asyncActionInitState,
	isLoading
} from "./asyncAction"

// To view accounts the user may select a predefined list view, or may select
// an option to view accounts by account IDs given via URL query parameter.
export const GIVEN_IDS = "givenIds"
export type ListViewLike = ListView | { id: typeof GIVEN_IDS }

export type State = AsyncActionState & {
	accountFieldSet: FieldSet,
	accountIds: ?(Id[]), // list of IDs provided via query parameter
	accountQueryResult: QueryResult | null,
	listViewDescriptions: { [key: Id]: ListViewDescription },
	listViews: ListViews | null,
	count: number | null,
	offset: number,
	pageSize: number,
	selectedSortField: ?SortField.SortField,
	sortFields: SortField.SortField[]
}

type Request = {
	listView: ListViewLike,
	limit: number,
	offset: number,
	sortBy: string,
	sortDirection: SortField.SortDirection
}

export default class AccountContainer extends Container<State> {
	_restClient: Promise<RestApi>
	_lastRequest: ?Request

	constructor(opts: {|
		accountFieldSet: FieldSet,
		accountIds?: ?(Id[]),
		pageSize?: number,
		restClient: Promise<RestApi>,
		sortFields?: SortField.SortField[]
	|}) {
		super()
		this._restClient = opts.restClient
		this.fetchListViews()
		const sortFields = sortBy(opts.sortFields || [], [
			s => SortField.getPrecedence(s)
		])
		this.state = {
			...asyncActionInitState,
			accountFieldSet: opts.accountFieldSet,
			accountIds: opts.accountIds,
			accountQueryResult: null,
			listViewDescriptions: {},
			listViews: null,
			count: null,
			offset: 0,
			pageSize: opts.pageSize || 5,
			selectedSortField: sortFields[0],
			sortFields
		}
	}

	getAccount(url: string): ?Account {
		const accounts = this.getAccounts()
		if (accounts) {
			return accounts.find(a => a.attributes.url === url)
		}
	}

	getAccounts(): ?(Account[]) {
		const result = this.state.accountQueryResult
		if (result) {
			return result.records
		}
	}

	getListViews(): ?(ListViewLike[]) {
		const listViews = this.state.listViews
		const views = listViews && listViews.listviews
		const ids = this.state.accountIds
		if (ids && ids.length > 0) {
			return [{ id: GIVEN_IDS }, ...(views || [])]
		} else {
			return views && [...views]
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

	getErrors(): Error[] {
		return this.state.errors
	}

	async dismissError(error: Error): Promise<void> {
		await this.setState(state => ({
			errors: state.errors.filter(e => e.message !== error.message)
		}))
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

	async selectListView(listView: ListViewLike): Promise<void> {
		const sortField = this.state.selectedSortField
		const request = {
			listView,
			limit: this.state.pageSize,
			offset: 0,
			sortBy: sortField ? SortField.getField(sortField) : "Account.Name",
			sortDirection: sortField
				? SortField.getDefaultSortOrder(sortField)
				: SortField.ASCENDING
		}
		await Promise.all([
			this._fetchAccounts(request),
			this._fetchRecordCount(request)
		])
	}

	async selectSortField(sortField: SortField.SortField): Promise<void> {
		const lastRequest = this._lastRequest
		if (!lastRequest) {
			return
		}
		const fetchPromise = this._fetchAccounts({
			...lastRequest,
			sortBy: SortField.getField(sortField),
			sortDirection: SortField.getDefaultSortOrder(sortField)
		})
		const updateStatePromise = this.setState({
			selectedSortField: sortField
		})
		await Promise.all([fetchPromise, updateStatePromise])
	}

	async fetchPage(pageNumber: number): Promise<void> {
		const lastRequest = this._lastRequest
		if (!lastRequest) {
			throw new Error("cannot fetch a page before a list view is selected")
		}
		const pageSize = this.state.pageSize
		const offset = (pageNumber - 1) * pageSize // page numbers start at 1
		const request = { ...lastRequest, limit: pageSize, offset }
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
		offset,
		sortBy,
		sortDirection
	}: Request): Promise<QueryResult> {
		const client = await this._restClient
		const fields = fieldList(this.state.accountFieldSet)
		const where = this._getWhereClause(listView)
		const orderDir = sortDirection === SortField.DESCENDING ? "DESC" : "ASC"
		const query = `SELECT ${fields} FROM Account ${where} ORDER BY ${sortBy} ${orderDir} NULLS FIRST, Id ASC NULLS FIRST LIMIT ${limit} OFFSET ${offset}`
		return client.query(query)
	}

	async _fetchRecordCount({ listView }: Request): Promise<void> {
		await asyncAction(this, async () => {
			const client = await this._restClient
			const where = this._getWhereClause(listView)
			const query = `SELECT COUNT() FROM Account ${where}`
			const result = await client.query(query)
			await this.setState({ count: result.totalSize })
		})
	}

	_getWhereClause(listView: ListViewLike): string {
		if (listView.id === GIVEN_IDS) {
			const ids = this.state.accountIds
			if (!ids || ids.length < 1) {
				throw new Error(
					"There are no account IDs present in the URL query string."
				)
			}
			return (
				"WHERE " +
				stringifyCondition({
					field: "Id",
					operator: "IN",
					values: ids.map(id => `'${id}'`)
				})
			)
		} else {
			return whereClause(this._getDescription(listView))
		}
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
