/* @flow strict */

import RestApi from "../api/RestApi"
import * as af from "../models/Account.testFixtures"
import * as lvf from "../models/ListView.testFixtures"
import { delay } from "../testHelpers"
import Accounts from "./Accounts"

const restClient = RestApi("0000")

const spies = restClient.then(client => ({
	listViewsSpy: jest.spyOn(client, "fetchListViews"),
	descriptionSpy: jest.spyOn(client, "fetchListViewDescription"),
	querySpy: jest.spyOn(client, "query")
}))

const accountFieldSet = [
	{ name: "Name", label: "Account Name", type: "string" },
	{ name: "Site", label: "Account Site", type: "string" },
	{ name: "CreatedDate", label: "Created Date", type: "datetime" },
	{ name: "Phone", label: "Account Phone", type: "phone" }
]

const opts = {
	accountFieldSet,
	restClient
}

afterEach(() => {
	jest.clearAllMocks()
})

it("requests Account list views on initialization", async () => {
	const { listViewsSpy } = await spies
	const accounts = new Accounts(opts)
	await delay()
	expect(listViewsSpy).toHaveBeenCalledWith("Account")
})

it("requests Account list views", async () => {
	const { listViewsSpy } = await spies
	const accounts = new Accounts(opts)
	await accounts.getListViews()
	expect(accounts.state.errors).toEqual([])
	expect(listViewsSpy).toHaveBeenCalledTimes(2) // once on initialization
	expect(accounts.state.listViews).toEqual(lvf.accountListViews)
})

it("requests results when an account list views is selected", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts(opts)

	const listView = lvf.accountListViews.listviews.find(
		v => v.id === "00Bf20000080l1oEAA"
	)
	if (!listView) {
		throw new Error('a fixture is missing')
	}
	await accounts.getListViews()
	await accounts.selectListView(listView)

	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account WHERE CreatedDate = THIS_WEEK\s+ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST/
		)
	)
	expect(accounts.state.accountQueryResult).toEqual(af.accountQueryResult)
})

it("includes scope clause in account query", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts(opts)

	const listView = lvf.accountListViews.listviews.find(
		v => v.id === "00Bf20000080l2ZEAQ"
	)
	if (!listView) {
		throw new Error('a fixture is missing')
	}
	await accounts.getListViews()
	await accounts.selectListView(listView)

	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+USING SCOPE mine/
		)
	)
	expect(accounts.state.accountQueryResult).toEqual(af.accountQueryResult)
})

it("provides a getter to extract account records from query results", async () => {
	const accounts = new Accounts(opts)
	const listView = lvf.accountListViews.listviews[0]
	const desc = lvf.accountListViewDescriptions[0]
	await accounts.getListViews()
	await accounts.selectListView(listView)
	expect(accounts.getAccounts()).toEqual(af.accountQueryResult.records)
})
