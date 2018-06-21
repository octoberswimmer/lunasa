/* @flow strict */

import { mount } from "enzyme"
import * as React from "react"
import * as f from "../models/ListView.testFixtures"
import AccountCard from "./AccountCard"
import SelectAccounts from "./SelectAccounts"

const onSelect = jest.fn()

afterEach(() => {
	jest.resetAllMocks()
})

it("displays list views in a select", () => {
	expect.assertions(f.accountListViews.listviews.length + 1)
	const wrapper = mount(
		<SelectAccounts
			listViews={f.accountListViews}
			onSelectListView={onSelect}
			results={null}
		/>
	)
	const options = wrapper.find('option')
	expect(options.length).toBe(f.accountListViews.listviews.length)
	for (const view of f.accountListViews.listviews) {
		const option = options.find(`[value="${view.id}"]`)
		expect(option.text()).toBe(view.label)
	}
})

it("invokes a callback when a list view is selected", () => {
	const wrapper = mount(
		<SelectAccounts
			listViews={f.accountListViews}
			onSelectListView={onSelect}
			results={null}
		/>
	)
	const listView = f.accountListViews.listviews[0]
	const select = wrapper.find('select')
	select.simulate('input')
	expect(onSelect).toHaveBeenCalledWith(listView)
})

it("displays accounts", () => {
	const wrapper = mount(
		<SelectAccounts
			listViews={f.accountListViews}
			onSelectListView={onSelect}
			results={f.accountResults}
		/>
	)
	const cards = wrapper.find(AccountCard)
	expect(cards.length).toBe(f.accountResults.records.length)
	const card = cards.first()
	expect(card.props()).toMatchObject({
		columns: f.accountResults.records[0].columns
	})
})
