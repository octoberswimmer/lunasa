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

import sortListBy from "lodash.sortby"
import { Container } from "unstated"
import { type RestApi } from "../api/RestApi"
import { type Account } from "../models/Account"
import { type FieldDefinition } from "../models/FieldDefinition"
import { type FieldSet, fieldList } from "../models/FieldSet"
import * as F from "../models/Filter"
import {
	type Id,
	type ListView,
	type ListViewDescription,
	type ListViews,
	whereClause
} from "../models/ListView"
import { type QueryResult } from "../models/QueryResult"
import * as SortField from "../models/SortField"
import { conjunction, stringifyCondition } from "../models/WhereCondition"
import {
	type AsyncActionState,
	asyncAction,
	asyncActionInitState,
	isLoading
} from "./asyncAction"
import { memoize } from "./memoize"

// To view accounts the user may select a predefined list view, or may select
// an option to view accounts by account IDs given via URL query parameter.
export const GIVEN_IDS = "givenIds"
export type ListViewLike = ListView | { id: typeof GIVEN_IDS }

export type State = AsyncActionState & {
	accountFieldSet: FieldSet,
	accountIds: ?(Id[]), // list of IDs provided via query parameter
	accountQueryResult: QueryResult | null,
	filters: F.Filter[],
	listViewDescriptions: { [key: Id]: ListViewDescription },
	listViews: ListViews | null,
	listView: ?ListViewLike,
	locale: string,
	count: number | null,
	offset: number,
	pageSize: number,
	selectedSortField: ?SortField.SortField,
	sortFields: SortField.SortField[],
	sortDirection: SortField.SortDirection,
	fieldDefinitions: FieldDefinition[]
}

type Request = {|
	accountFieldSet: FieldSet,
	filters: F.Filter[],
	listView: ListViewLike,
	locale: string,
	limit: number,
	offset: number,
	sortBy: string,
	sortDirection: SortField.SortDirection
|}

export default class AccountContainer extends Container<State> {
	_restClient: Promise<RestApi>
	_lastRequest: ?Request

	_queryAccountReferenceInformation: (
		referenceFields: string[],
		accountId: string
	) => Promise<any>

	constructor(opts: {|
		accountFieldSet: FieldSet,
		accountIds?: ?(Id[]),
		locale?: ?string, // e.g. "en_US"
		pageSize?: number,
		restClient: Promise<RestApi>,
		sortFields?: SortField.SortField[],
		fieldDefinitions?: FieldDefinition[]
	|}) {
		super()
		this._restClient = opts.restClient
		this.fetchListViews()
		const sortFields = sortListBy(opts.sortFields || [], [
			s => SortField.getPrecedence(s)
		])
		const defaultSortField = sortFields[0]
		this.state = {
			...asyncActionInitState,
			accountFieldSet: opts.accountFieldSet,
			accountIds: opts.accountIds,
			accountQueryResult: null,
			filters: [],
			listViewDescriptions: {},
			listViews: null,
			listView: null,
			locale: opts.locale || navigator.language,
			count: null,
			offset: 0,
			pageSize: opts.pageSize || 5,
			selectedSortField: defaultSortField,
			sortFields,
			sortDirection: defaultSortField
				? SortField.getDefaultSortOrder(defaultSortField)
				: SortField.ASCENDING,
			fieldDefinitions: opts.fieldDefinitions || []
		}
		this._queryAccountReferenceInformation = memoize(this._queryAccountReferenceInformation.bind(this))

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

	async getAccountReferenceData(fields: string[], accountId: string): ?any {
		return await this._queryAccountReferenceInformation(fields, accountId)
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

	async applyFilter(filter: F.Filter): Promise<void> {
		await this.setState(state => ({
			filters: F.applyFilter(state.filters, filter),
			offset: 0
		}))
		await this._fetchAccounts()
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
		await this.setState({ listView, offset: 0 })
		await this._fetchAccounts()
	}

	async selectSortDirection(
		sortDirection: SortField.SortDirection
	): Promise<void> {
		await this.setState({ sortDirection })
		await this._fetchAccounts()
	}

	async selectSortField(sortField: SortField.SortField): Promise<void> {
		await this.setState(state => ({
			selectedSortField: sortField,
			sortDirection: SortField.getDefaultSortOrder(sortField),
			//display all records since the alphabet is hidden for non string sort fields
			filters: SortField.isStringFilter(state.fieldDefinitions, sortField)
				? state.filters
				: F.applyFilter(state.filters, F.firstLetterAny()),
			offset: 0
		}))
		await this._fetchAccounts()
	}

	async fetchPage(pageNumber: number): Promise<void> {
		await this.setState(state => {
			const pageSize = state.pageSize
			const offset = (pageNumber - 1) * pageSize // page numbers start at 1
			return { offset }
		})
		await this._fetchAccounts()
	}

	async _fetchAccounts(): Promise<void> {
		const request = this._buildRequest()
		if (!request) {
			return
		}

		// Get updated record count when changing list view or filters.
		const recordSetChanged =
			!this._lastRequest ||
			(request.listView !== this._lastRequest.listView ||
				request.filters !== this._lastRequest.filters)

		this._lastRequest = request

		await asyncAction(this, async () => {
			const totalSizePromise = recordSetChanged
				? this._fetchRecordCount(request)
				: Promise.resolve(this.state.count)
			const [accountQueryResult, totalSize] = await Promise.all([
				this._queryAccounts(request),
				totalSizePromise
			])
			// Make sure that the result from a long-running query does not
			// replace data from a more-recent, faster query.
			if (this._lastRequest === request) {
				await this.setState({
					accountQueryResult,
					offset: request.offset,
					count: totalSize
				})
			}
		})
	}

	_buildRequest(): ?Request {
		const {
			accountFieldSet,
			filters,
			listView,
			locale,
			offset,
			pageSize,
			selectedSortField,
			sortDirection,
			fieldDefinitions
		} = this.state
		if (!listView) {
			return
		}
		return {
			accountFieldSet,
			filters,
			listView,
			locale,
			limit: pageSize,
			offset,
			sortBy: selectedSortField
				? SortField.getFieldForSoql(selectedSortField, fieldDefinitions)
				: "Account.Name",
			sortDirection
		}
	}

	async _queryAccounts(request: Request): Promise<QueryResult> {
		const { accountFieldSet, limit, offset, sortDirection, sortBy } = request
		const client = await this._restClient
		const fields = fieldList(accountFieldSet)
		const where = this._getWhereClause(request)
		const orderDir = sortDirection === SortField.DESCENDING ? "DESC" : "ASC"
		const query = `SELECT ${fields} FROM Account ${where} ORDER BY ${sortBy} ${orderDir} NULLS FIRST, Id ASC NULLS FIRST LIMIT ${limit} OFFSET ${offset}`
		return client.query(query)
	}

	async _queryAccountReferenceInformation(
		referenceFields: string[],
		accountId: string
	): ?any {
		const client = await this._restClient
		const fields = referenceFields.join(",")
		const query = `SELECT ${fields} FROM Account WHERE Id = '${accountId}'`
		const result = await client.query(query)
		const record = await result.records[0]
		return record
	}

	async _fetchRecordCount(req: Request): Promise<number> {
		const client = await this._restClient
		const where = this._getWhereClause(req)
		const query = `SELECT COUNT() FROM Account ${where}`
		const result = await client.query(query)
		return result.totalSize
	}

	_getWhereClause({ sortBy, filters, listView, locale }: Request): string {
		const filterCondition = F.whereCondition(filters, { locale }, sortBy)
		if (listView.id === GIVEN_IDS) {
			const ids = this.state.accountIds
			if (!ids || ids.length < 1) {
				throw new Error(
					"There are no account IDs present in the URL query string."
				)
			}
			return (
				"WHERE " +
				stringifyCondition(
					conjunction("AND", [
						{
							field: "Id",
							operator: "IN",
							values: ids.map(id => `'${id}'`)
						},
						filterCondition
					])
				)
			)
		} else {
			return whereClause(this._getDescription(listView), [filterCondition])
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
