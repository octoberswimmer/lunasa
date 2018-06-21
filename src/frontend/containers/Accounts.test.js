/* @flow strict */

import listViewsClient, { type ListViewsApi } from "../api/ListViews"
import * as f from "../models/ListView.testFixtures"
import { delay } from "../testHelpers"
import Accounts from "./Accounts"

const spies = listViewsClient.then(client => {
	const listViewsSpy = jest.spyOn(client, "fetchListViews")
	const resultsSpy = jest.spyOn(client, "fetchResults")
	return { listViewsSpy, resultsSpy }
})

afterEach(() => {
	jest.clearAllMocks()
})

it("requests Account list views on initialization", async () => {
	const { listViewsSpy } = await spies
	const accounts = new Accounts()
	await delay()
	expect(listViewsSpy).toHaveBeenCalledWith("Account")
})

it("requests Account list views", async () => {
	const { listViewsSpy } = await spies
	const accounts = new Accounts()
	await accounts.getListViews()
	expect(listViewsSpy).toHaveBeenCalledTimes(2)
	expect(accounts.state.listViews).toEqual(f.accountListViews)
})

it("requests results when an account list views is selected", async () => {
	const { resultsSpy } = await spies
	const accounts = new Accounts()
	const listView = f.accountListViews.listviews[0]
	await accounts.selectListView(listView)
	expect(resultsSpy).toHaveBeenCalledWith(listView)
	expect(accounts.state.results).toEqual(f.accountResults)
})
