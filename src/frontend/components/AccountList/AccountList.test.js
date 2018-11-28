/* @flow strict */

import Button from "@salesforce/design-system-react/components/button"
import * as enzyme from "enzyme"
import * as React from "react"
import { Provider } from "unstated"
import RestApi from "../../api/RestApi"
import Accounts, { GIVEN_IDS } from "../../containers/Accounts"
import * as af from "../../models/Account.testFixtures"
import * as clf from "../../models/CustomLabel.testFixtures"
import * as lf from "../../models/ListView.testFixtures"
import * as SortField from "../../models/SortField"
import * as sff from "../../models/SortField.testFixtures"
import { delay, failIfMissing } from "../../testHelpers"
import AccountCard from "../AccountCard"
import AccountList from "../AccountList"
import { LabelProvider } from "../i18n/Label"

const accountsOpts = {
	accountFieldSet: af.accountFieldSet,
	restClient: RestApi("0000"),
	sortFields: sff.sortFields
}

const sortByName = failIfMissing(
	sff.sortFields.find(s => SortField.getField(s) === "Account.Name")
)
const sortByCreatedDate = failIfMissing(
	sff.sortFields.find(s => SortField.getField(s) === "Account.CreatedDate")
)

it("displays list views in a select", async () => {
	expect.assertions(lf.accountListViews.listviews.length + 1)
	const accounts = new Accounts(accountsOpts)
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.fetchListViews()
	wrapper.update()
	const options = wrapper.find("select.select-list-view option")
	expect(options.length).toBe(lf.accountListViews.listviews.length)
	for (const view of lf.accountListViews.listviews) {
		const option = options.find(`[value="${view.id}"]`)
		expect(option.text()).toBe(view.label)
	}
})

it("displays a special list view for accounts specified by query parameter", async () => {
	const accounts = new Accounts({
		...accountsOpts,
		accountIds: [
			"001f200001XrDt1AAF",
			"001f200001XrDt2AAF",
			"001f200001XrDt0AAF"
		]
	})
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.fetchListViews()
	wrapper.update()
	const firstOption = wrapper.find("option").first()
	expect(firstOption.text()).toBe("Selected Accounts")
	expect(firstOption.props()).toHaveProperty("value", GIVEN_IDS)
})

it("loads accounts on mount if account IDs are provided via query parameter", async () => {
	const accounts = new Accounts({
		...accountsOpts,
		accountIds: [
			"001f200001XrDt1AAF",
			"001f200001XrDt2AAF",
			"001f200001XrDt0AAF"
		]
	})
	const selectListView = jest.spyOn(accounts, "selectListView")
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	expect(selectListView).toHaveBeenCalledWith({ id: GIVEN_IDS })
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
	const select = wrapper.find("select.select-list-view")
	select.instance().value = listView.id
	select.simulate("input")
	expect(selectListView).toHaveBeenCalledTimes(2) // once on initialization
	expect(selectListView).toHaveBeenCalledWith(listView)
})

it("presents sort options", () => {
	const accounts = new Accounts(accountsOpts)
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	const select = wrapper.find("select.select-sort-field")
	expect(select).toContainReact(
		<option value={sortByName.Id}>Account Name</option>
	)
	expect(select).toContainReact(
		<option value={sortByCreatedDate.Id}>Account Created Date</option>
	)
})

it("updates accounts state when a sort option is selected", () => {
	const accounts = new Accounts(accountsOpts)
	jest.spyOn(accounts, "selectSortField")
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	const select = wrapper.find("select.select-sort-field")
	select.instance().value = sortByCreatedDate.Id
	select.simulate("change")
	expect(accounts.selectSortField).toHaveBeenCalledWith(sortByCreatedDate)
})

it("updates accounts state when a sort direction is selected", async () => {
	const accounts = new Accounts(accountsOpts)
	jest.spyOn(accounts, "selectSortDirection")
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	wrapper
		.find(Button)
		.filter(".toggle-sort-direction")
		.simulate("click")
	expect(accounts.selectSortDirection).toHaveBeenCalledWith(
		SortField.DESCENDING
	)

	await delay()
	wrapper
		.find(Button)
		.filter(".toggle-sort-direction")
		.simulate("click")
	expect(accounts.selectSortDirection).toHaveBeenCalledWith(SortField.ASCENDING)
})

it("selects the sort option that is selected in accounts state", async () => {
	const accounts = new Accounts(accountsOpts)
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.setState({ selectedSortField: sortByCreatedDate })
	wrapper.update()
	const select = wrapper.find("select.select-sort-field")
	expect(select).toHaveProp("value", sortByCreatedDate.Id)
})

it("selects the sort direction that is selected in accounts state", async () => {
	const accounts = new Accounts(accountsOpts)
	const wrapper = mount(<AccountList fieldSet={af.accountFieldSet} />, {
		accounts
	})
	await accounts.selectSortDirection(SortField.DESCENDING)
	wrapper.update()
	const button = wrapper.find(Button).filter(".toggle-sort-direction")
	expect(button).toHaveProp("iconName", "arrowdown")
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

// Unmount React tree after each test to avoid errors about missing `document`,
// and to avoid slowdown from accumulated React trees.
let _wrapper: enzyme.ReactWrapper
afterEach(() => {
	if (_wrapper) {
		_wrapper.unmount()
	}
})

// Helper that wraps `<App/>` with a necessary `<Provider>` from unstated.
function mount(
	component: React.Node,
	containers?: {| accounts?: Accounts |}
): enzyme.ReactWrapper {
	const accounts =
		(containers && containers.accounts) || new Accounts(accountsOpts)
	_wrapper = enzyme.mount(
		<Provider inject={[accounts]}>
			<LabelProvider value={clf.labels}>{component}</LabelProvider>
		</Provider>
	)
	return _wrapper
}
