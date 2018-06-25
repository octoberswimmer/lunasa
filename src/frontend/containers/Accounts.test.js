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
	await accounts.fetchListViews()
	expect(accounts.state.errors).toEqual([])
	expect(listViewsSpy).toHaveBeenCalledTimes(2) // once on initialization
	expect(accounts.state.listViews).toEqual(lvf.accountListViews)
})

it("requests accounts and record count when an account list view is selected", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts(opts)

	const listView = lvf.accountListViews.listviews.find(
		v => v.id === "00Bf20000080l1oEAA"
	)
	if (!listView) {
		throw new Error("a fixture is missing")
	}
	await accounts.fetchListViews()
	await accounts.selectListView(listView)

	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE CreatedDate = THIS_WEEK\s+ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 0\s*$/
		)
	)
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT COUNT\(\) FROM Account WHERE CreatedDate = THIS_WEEK\s*$/
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
		throw new Error("a fixture is missing")
	}
	await accounts.fetchListViews()
	await accounts.selectListView(listView)

	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+USING SCOPE mine/
		)
	)
	expect(accounts.state.accountQueryResult).toEqual(af.accountQueryResult)
})

it("fetches pages of results", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts(opts)

	const listView = lvf.accountListViews.listviews.find(
		v => v.id === "00Bf20000080l2PEAQ"
	)
	if (!listView) {
		throw new Error("a fixture is missing")
	}
	await accounts.fetchListViews()
	await accounts.selectListView(listView)
	await accounts.fetchPage(2)

	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 5\s*$/
		)
	)
	expect(accounts.state.accountQueryResult).toEqual(af.accountQueryResult)
})

it("provides a getter to extract account records from query results", async () => {
	const accounts = new Accounts(opts)
	const listView = lvf.accountListViews.listviews[0]
	const desc = lvf.accountListViewDescriptions[0]
	await accounts.fetchListViews()
	await accounts.selectListView(listView)
	expect(accounts.getAccounts()).toEqual(af.accountQueryResult.records)
})

it("provides the current page number", async () => {
	const accounts = new Accounts(opts)
	await accounts.setState({ pageSize: 5, offset: 11 })
	expect(accounts.currentPageNumber()).toBe(3)
})

it("provides the total page count if known", async () => {
	const accounts = new Accounts(opts)
	expect(accounts.pageCount()).not.toBeDefined()
	await accounts.setState({ pageSize: 5, count: 30 })
	expect(accounts.pageCount()).toBe(6)
})
