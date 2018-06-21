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
import listViewsClient, { type ListViewsApi } from "../api/ListViews"
import { type ListViews, type ListView, type Results } from "../models/ListView"
import {
	type AsyncActionState,
	asyncAction,
	asyncActionInitState,
	isLoading
} from "./asyncAction"

export type State = AsyncActionState & {
	listViews: ListViews | null,
	results: Results | null
}

export default class AccountContainer extends Container<State> {
	_apiClient: Promise<ListViewsApi>
	_lastRequested: ?ListView
	state = {
		...asyncActionInitState,
		listViews: null,
		results: null
	}

	constructor(apiClient: Promise<ListViewsApi> = listViewsClient) {
		super()
		this._apiClient = apiClient
		this.getListViews()
	}

	isLoading(): boolean {
		return isLoading(this)
	}

	async getListViews(): Promise<void> {
		await asyncAction(this, async () => {
			const client = await this._apiClient
			const listViews = await client.fetchListViews("Account")
			await this.setState({ listViews })
		})
	}

	async selectListView(listView: ListView): Promise<void> {
		this._lastRequested = listView
		await asyncAction(this, async () => {
			const client = await this._apiClient
			const results = await client.fetchResults(listView)
			if (this._lastRequested === listView) {
				await this.setState({ results })
			}
		})
	}
}
