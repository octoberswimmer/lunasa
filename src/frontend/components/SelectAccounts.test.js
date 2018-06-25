/* @flow strict */

import { mount } from "enzyme"
import * as React from "react"
import * as af from "../models/Account.testFixtures"
import * as lf from "../models/ListView.testFixtures"
import AccountCard from "./AccountCard"
import SelectAccounts from "./SelectAccounts"

const onSelect = jest.fn()

afterEach(() => {
	jest.resetAllMocks()
})

it("displays list views in a select", () => {
	expect.assertions(lf.accountListViews.listviews.length + 1)
	const wrapper = mount(
		<SelectAccounts
			accounts={null}
			fieldSet={af.accountFieldSet}
			listViews={lf.accountListViews}
			onSelectListView={onSelect}
		/>
	)
	const options = wrapper.find('option')
	expect(options.length).toBe(lf.accountListViews.listviews.length)
	for (const view of lf.accountListViews.listviews) {
		const option = options.find(`[value="${view.id}"]`)
		expect(option.text()).toBe(view.label)
	}
})

it("invokes a callback when a list view is selected", () => {
	const wrapper = mount(
		<SelectAccounts
			accounts={null}
			fieldSet={af.accountFieldSet}
			listViews={lf.accountListViews}
			onSelectListView={onSelect}
		/>
	)
	const listView = lf.accountListViews.listviews[0]
	const select = wrapper.find('select')
	select.simulate('input')
	expect(onSelect).toHaveBeenCalledWith(listView)
})

it("displays accounts", () => {
	const wrapper = mount(
		<SelectAccounts
			accounts={af.accountQueryResult.records}
			fieldSet={af.accountFieldSet}
			listViews={lf.accountListViews}
			onSelectListView={onSelect}
		/>
	)
	const cards = wrapper.find(AccountCard)
	expect(cards.length).toBe(af.accountQueryResult.records.length)
	const card = cards.first()
	expect(card.props()).toMatchObject({
		record: af.accountQueryResult.records[0]
	})
})
