/* @flow strict */

import RestApi from "../api/RestApi"
import * as af from "../models/Account.testFixtures"
import * as fdf from "../models/FieldDefinition.testFixtures"
import * as F from "../models/Filter"
import * as lvf from "../models/ListView.testFixtures"
import * as SortField from "../models/SortField"
import * as sff from "../models/SortField.testFixtures"
import { delay, failIfMissing } from "../testHelpers"
import Accounts, { GIVEN_IDS } from "./Accounts"

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
	restClient,
	sortFields: sff.sortFields,
	fieldDefinitions: fdf.fieldDefinitions
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

it("includes a special list view when account IDs are given via query parameter", async () => {
	const accounts = new Accounts({
		...opts,
		accountIds: [
			"001f200001XrDt1AAF",
			"001f200001XrDt2AAF",
			"001f200001XrDt0AAF"
		]
	})
	await accounts.fetchListViews()
	const listViews = failIfMissing(accounts.getListViews())
	expect(listViews[0]).toHaveProperty("id", GIVEN_IDS)
})

it("does not include special list view when account IDs are *not* provided via query parameter", async () => {
	const accounts = new Accounts(opts)
	await accounts.fetchListViews()
	const listViews = failIfMissing(accounts.getListViews())
	expect(listViews[0]).not.toHaveProperty("id", GIVEN_IDS)
})

it("sorts sort fields by precedence", () => {
	const sortFields = sff.sortFields.slice()
	sortFields.reverse()
	const accounts = new Accounts({
		...opts,
		sortFields
	})
	expect(accounts.state.sortFields).toHaveLength(2)
	expect(
		SortField.getFieldForSoql(
			accounts.state.sortFields[0],
			fdf.fieldDefinitions
		)
	).toBe("Account.Name")
	expect(
		SortField.getFieldForSoql(
			accounts.state.sortFields[1],
			fdf.fieldDefinitions
		)
	).toBe("Account.CreatedDate")
	const selected = accounts.state.selectedSortField
	expect(
		selected && SortField.getFieldForSoql(selected, fdf.fieldDefinitions)
	).toBe("Account.Name")
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
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE CreatedDate = THIS_WEEK\s+ORDER BY Account.Name ASC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 0\s*$/
		)
	)
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT COUNT\(\) FROM Account WHERE CreatedDate = THIS_WEEK\s*$/
		)
	)
	expect(accounts.state.accountQueryResult).toEqual(af.accountQueryResult)
})

it("sorts results when a list view is selected", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts(opts)
	const sortField = failIfMissing(
		sff.sortFields.find(
			s =>
				SortField.getFieldForSoql(s, fdf.fieldDefinitions) ===
				"Account.CreatedDate"
		)
	)
	await accounts.selectSortField(sortField)

	const listView = failIfMissing(
		lvf.accountListViews.listviews.find(v => v.id === "00Bf20000080l1oEAA")
	)
	await accounts.fetchListViews()
	await accounts.selectListView(listView)

	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE CreatedDate = THIS_WEEK\s+ORDER BY Account.CreatedDate DESC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 0\s*$/
		)
	)
})

it("requests accounts and record count when the 'given IDs' view is selected", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts({
		...opts,
		accountIds: [
			"001f200001XrDt1AAF",
			"001f200001XrDt2AAF",
			"001f200001XrDt0AAF"
		]
	})
	await accounts.selectListView({ id: GIVEN_IDS })
	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE Id IN \('001f200001XrDt1AAF', '001f200001XrDt2AAF', '001f200001XrDt0AAF'\)\s+ORDER BY Account.Name ASC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 0\s*$/
		)
	)
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT COUNT\(\) FROM Account WHERE Id IN \('001f200001XrDt1AAF', '001f200001XrDt2AAF', '001f200001XrDt0AAF'\)\s*$/
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

it("changes result sorting when requested", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts({
		...opts,
		accountIds: [
			"001f200001XrDt1AAF",
			"001f200001XrDt2AAF",
			"001f200001XrDt0AAF"
		]
	})
	await accounts.selectListView({ id: GIVEN_IDS })
	await accounts.selectSortField(
		failIfMissing(
			sff.sortFields.find(
				s =>
					SortField.getFieldForSoql(s, fdf.fieldDefinitions) ===
					"Account.CreatedDate"
			)
		)
	)
	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE Id IN \('001f200001XrDt1AAF', '001f200001XrDt2AAF', '001f200001XrDt0AAF'\)\s+ORDER BY Account.CreatedDate DESC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 0\s*$/
		)
	)
	expect(accounts.state.accountQueryResult).toEqual(af.accountQueryResult)
})

it("toggles sort direction", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts(opts)
	const listView = failIfMissing(
		lvf.accountListViews.listviews.find(v => v.id === "00Bf20000080l1oEAA")
	)
	await accounts.fetchListViews()
	await accounts.selectListView(listView)
	await accounts.selectSortDirection(SortField.DESCENDING)

	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE CreatedDate = THIS_WEEK\s+ORDER BY Account.Name DESC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 0\s*$/
		)
	)
})

it("defaults to all filter when sorting non string", async () => {
	const accounts = new Accounts({
		...opts,
		accountIds: [
			"001f200001XrDt1AAF",
			"001f200001XrDt2AAF",
			"001f200001XrDt0AAF"
		]
	})
	await accounts.setState({ filters: [F.firstLetter("b")] })
	expect(accounts.state.filters).toEqual([F.firstLetter("b")])

	await accounts.selectSortField(
		failIfMissing(
			sff.sortFields.find(
				s =>
					SortField.getFieldForSoql(s, fdf.fieldDefinitions) ===
					"Account.CreatedDate"
			)
		)
	)
	expect(JSON.stringify(accounts.state.filters)).toEqual(
		JSON.stringify([F.firstLetterAny()])
	)
})

it("preserves sort direction when changing list views", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts(opts)
	const newThisWeek = failIfMissing(
		lvf.accountListViews.listviews.find(v => v.id === "00Bf20000080l1oEAA")
	)
	const newLastWeek = failIfMissing(
		lvf.accountListViews.listviews.find(v => v.id === "00Bf20000080l1zEAA")
	)
	await accounts.fetchListViews()
	await accounts.selectListView(newThisWeek)
	await accounts.selectSortDirection(SortField.DESCENDING)
	await accounts.selectListView(newLastWeek)

	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE CreatedDate = LAST_WEEK\s+ORDER BY Account.Name DESC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 0\s*$/
		)
	)
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
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+ORDER BY Account.Name ASC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 5\s*$/
		)
	)
	expect(accounts.state.accountQueryResult).toEqual(af.accountQueryResult)
})

it("fetches pages of results when the 'given IDs' view is selected", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts({
		...opts,
		accountIds: [
			"001f200001XrDt1AAF",
			"001f200001XrDt2AAF",
			"001f200001XrDt0AAF"
		]
	})
	await accounts.selectListView({ id: GIVEN_IDS })
	await accounts.fetchPage(2)
	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE Id IN \('001f200001XrDt1AAF', '001f200001XrDt2AAF', '001f200001XrDt0AAF'\)\s+ORDER BY Account.Name ASC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 5\s*$/
		)
	)
	expect(accounts.state.accountQueryResult).toEqual(af.accountQueryResult)
})

it("sorts results when fetching pages", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts({
		...opts,
		accountIds: [
			"001f200001XrDt1AAF",
			"001f200001XrDt2AAF",
			"001f200001XrDt0AAF"
		]
	})
	const sortField = failIfMissing(
		sff.sortFields.find(
			s =>
				SortField.getFieldForSoql(s, fdf.fieldDefinitions) ===
				"Account.CreatedDate"
		)
	)
	await accounts.selectSortField(sortField)
	await accounts.selectListView({ id: GIVEN_IDS })
	await accounts.fetchPage(2)
	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE Id IN \('001f200001XrDt1AAF', '001f200001XrDt2AAF', '001f200001XrDt0AAF'\)\s+ORDER BY Account.CreatedDate DESC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 5\s*$/
		)
	)
	expect(accounts.state.accountQueryResult).toEqual(af.accountQueryResult)
})

it("filters by first letter of account name", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts({
		...opts,
		accountIds: ["001f200001XrDt1AAF"]
	})
	const filter = F.firstLetter("a")
	await accounts.selectListView({ id: GIVEN_IDS })
	await accounts.applyFilter(filter)
	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE \(Id IN \('001f200001XrDt1AAF'\)\) AND \(Account.Name LIKE 'a%'\)\s+ORDER BY Account.Name ASC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 0\s*$/
		)
	)
	expect(accounts.state.accountQueryResult).toEqual(af.accountQueryResult)
})

it("filters to accounts with names that start with an 'Other' letter", async () => {
	const { querySpy } = await spies
	const accounts = new Accounts({
		...opts,
		accountIds: ["001f200001XrDt1AAF"]
	})
	await accounts.selectListView({ id: GIVEN_IDS })
	await accounts.applyFilter(F.firstLetter("a"))
	await accounts.applyFilter(F.firstLetterOther())
	expect(accounts.state.errors).toEqual([])
	expect(querySpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/SELECT Name, Site, CreatedDate, Phone FROM Account\s+WHERE \(Id IN \('001f200001XrDt1AAF'\)\) AND \(NOT \(\(Account.Name LIKE 'a%'\) OR.*\)\)\s+ORDER BY Account.Name ASC NULLS FIRST, Id ASC NULLS FIRST\s+LIMIT 5\s+OFFSET 0\s*$/
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

it("looks up an account by its URL", async () => {
	const accounts = new Accounts(opts)
	const account = af.accountQueryResult.records.find(
		r => r.Name === "United Oil & Gas, UK"
	)
	expect(account).toBeDefined()
	await accounts.setState({ accountQueryResult: af.accountQueryResult })
	expect(
		accounts.getAccount(
			"/services/data/v40.0/sobjects/Account/001f200001XrDt3AAF"
		)
	).toEqual(account)
})

it("offset is zeroed when sorting", async () => {
	const accounts = new Accounts({
		...opts,
		accountIds: [
			"001f200001XrDt1AAF",
			"001f200001XrDt2AAF",
			"001f200001XrDt0AAF"
		]
	})
	await accounts.setState({ offset: 100 })
	expect(accounts.state.offset).toBe(100)

	await accounts.selectSortField(
		failIfMissing(
			sff.sortFields.find(
				s =>
					SortField.getFieldForSoql(s, fdf.fieldDefinitions) ===
					"Account.CreatedDate"
			)
		)
	)
	expect(accounts.state.offset).toBe(0)
})
