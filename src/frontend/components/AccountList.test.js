/* @flow strict */

import * as enzyme from "enzyme"
import * as React from "react"
import { Provider } from "unstated"
import RestApi from "../api/RestApi"
import Accounts from "../containers/Accounts"
import * as af from "../models/Account.testFixtures"
import * as lf from "../models/ListView.testFixtures"
import AccountCard from "./AccountCard"
import AccountList from "./AccountList"

const accountsOpts = {
	accountFieldSet: af.accountFieldSet,
	restClient: RestApi("0000")
}

it("displays list views in a select", async () => {
	expect.assertions(lf.accountListViews.listviews.length + 1)
	const accounts = new Accounts(accountsOpts)
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.fetchListViews()
	wrapper.update()
	const options = wrapper.find("option")
	expect(options.length).toBe(lf.accountListViews.listviews.length)
	for (const view of lf.accountListViews.listviews) {
		const option = options.find(`[value="${view.id}"]`)
		expect(option.text()).toBe(view.label)
	}
})

it("updates state container with initially-selected list view", async () => {
	const accounts = new Accounts(accountsOpts)
	const selectListView = jest.spyOn(accounts, "selectListView")
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.fetchListViews()
	wrapper.update()
	const listView = lf.accountListViews.listviews[0]
	expect(selectListView).toHaveBeenCalledWith(listView)
})

it("updates state container when a list view is selected", async () => {
	const accounts = new Accounts(accountsOpts)
	const selectListView = jest.spyOn(accounts, "selectListView")
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.fetchListViews()
	wrapper.update()
	const listView = lf.accountListViews.listviews.find(
		v => v.id === "00Bf20000080l2GEAQ"
	)
	if (!listView) {
		throw new Error("a fixture is missing")
	}
	const select = wrapper.find("select")
	select.instance().value = listView.id
	select.simulate("input")
	expect(selectListView).toHaveBeenCalledTimes(2) // once on initialization
	expect(selectListView).toHaveBeenCalledWith(listView)
})

it("displays accounts", async () => {
	const accounts = new Accounts(accountsOpts)
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.setState({ accountQueryResult: af.accountQueryResult })
	wrapper.update()
	const cards = wrapper.find(AccountCard)
	expect(cards.length).toBe(af.accountQueryResult.records.length)
	const card = cards.first()
	expect(card.props()).toMatchObject({
		record: af.accountQueryResult.records[0]
	})
})

it("displays pagination controls", async () => {
	const accounts = new Accounts(accountsOpts)
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.setState({ offset: 11, pageSize: 5, count: 30 })
	wrapper.update()
	expect(wrapper.text()).toMatch("Page 3 of 6")
})

it("navigates to the previous page and to the next page", async () => {
	const accounts = new Accounts(accountsOpts)
	const fetchPage = jest.spyOn(accounts, "fetchPage")
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.setState({ offset: 11, pageSize: 5, count: 30 })
	wrapper.update()
	const prev = wrapper.find("button.previousPage")
	const next = wrapper.find("button.nextPage")
	prev.simulate("click")
	expect(fetchPage).toHaveBeenCalledWith(2)
	next.simulate("click")
	expect(fetchPage).toHaveBeenCalledWith(4)
})

it("disables the previous page button on the first page", async () => {
	const accounts = new Accounts(accountsOpts)
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.setState({ offset: 0, pageSize: 5, count: 30 })
	wrapper.update()
	expect(wrapper.text()).toMatch("Page 1 of 6")
	const prev = wrapper.find("button.previousPage")
	expect(prev.props()).toHaveProperty("disabled", true)
})

it("disables the next page button on the first page", async () => {
	const accounts = new Accounts(accountsOpts)
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.setState({ offset: 26, pageSize: 5, count: 30 })
	wrapper.update()
	expect(wrapper.text()).toMatch("Page 6 of 6")
	const next = wrapper.find("button.nextPage")
	expect(next.props()).toHaveProperty("disabled", true)
})

// Helper that wraps `<App/>` with a necessary `<Provider>` from unstated.
function mount(
	component: React.Node,
	containers?: {| accounts?: Accounts |}
): enzyme.ReactWrapper {
	const accounts =
		(containers && containers.accounts) || new Accounts(accountsOpts)
	return enzyme.mount(<Provider inject={[accounts]}>{component}</Provider>)
}
