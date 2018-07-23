/* @flow strict */

import Button from "@salesforce/design-system-react/components/button"
import classNames from "classnames"
import * as React from "react"
import { Subscribe } from "unstated"
import Accounts, { type ListViewLike, GIVEN_IDS } from "../containers/Accounts"
import { type Account } from "../models/Account"
import { type FieldSet } from "../models/FieldSet"
import { type SortField } from "../models/SortField"
import AccountCard from "./AccountCard"
import "./AccountList.css"

type Props = {
	className?: string | string[],
	fieldSet: FieldSet,
	spinner?: string // path to spinner image
}

export default function AccountList(props: Props) {
	return (
		<Subscribe to={[Accounts]}>
			{accounts => (
				<div className={classNames("account-list", props.className)}>
					<div className="select-wrapper">
						<SelectAccountListView
							listViews={accounts.getListViews()}
							onSelectListView={listView => {
								accounts.selectListView(listView)
							}}
						/>
						{accounts.isLoading() ? (
							<img
								alt="Loading..."
								className="loading-spinner"
								src={props.spinner}
							/>
						) : null}
					</div>
					<SelectSortField
						onSelectSortField={sortField => {
							accounts.selectSortField(sortField)
						}}
						selected={accounts.state.selectedSortField}
						sortFields={accounts.state.sortFields}
					/>
					<div className="account-card-list">
						<AccountCards
							accounts={accounts.getAccounts()}
							fieldSet={props.fieldSet}
						/>
					</div>
					<Pagination
						currentPage={accounts.currentPageNumber()}
						onSelectPage={p => accounts.fetchPage(p)}
						pageCount={accounts.pageCount()}
					/>
				</div>
			)}
		</Subscribe>
	)
}

type SelectProps = {
	listViews: ?(ListViewLike[]),
	onSelectListView(listView: ListViewLike): void
}

class SelectAccountListView extends React.Component<SelectProps> {
	onInput: (event?: SyntheticInputEvent<>) => void
	select: { current: null | React.ElementRef<"select"> }

	constructor(props: SelectProps) {
		super(props)
		this.onInput = this.onInput.bind(this)
		this.select = React.createRef()
	}

	componentDidMount() {
		this.onInput()
	}

	componentDidUpdate(prevProps: SelectProps) {
		// Trigger fetch for accounts from the first list view when list views
		// load.
		if (!prevProps.listViews) {
			this.onInput()
		}
	}

	render() {
		const { listViews } = this.props
		const listViewOptions = listViews
			? listViews.map(view => (
					<option value={view.id} key={view.id}>
						{labelFor(view)}
					</option>
			  ))
			: []
		return (
			<select
				className="slds-select select-list-view"
				onInput={this.onInput}
				ref={this.select}
			>
				{listViewOptions}
			</select>
		)
	}

	onInput(event?: SyntheticInputEvent<>) {
		const { onSelectListView, listViews } = this.props
		const select = this.select.current
		if (!select || !listViews) {
			return
		}
		const listViewId = select.value
		const listView = listViews.filter(view => view.id === listViewId)[0]
		if (listView) {
			onSelectListView(listView)
		}
	}
}

function labelFor(listView: ListViewLike): string {
	if (listView.id === GIVEN_IDS) {
		return "Selected Accounts"
	} else {
		return listView.label
	}
}

function SelectSortField(props: {
	onSelectSortField: (s: SortField) => void,
	selected?: ?SortField,
	sortFields: SortField[]
}) {
	const selectedId = props.selected ? props.selected.Id : ""

	const options = props.sortFields.map(({ Id, Label }) => (
		<option value={Id} key={Id}>
			{Label}
		</option>
	))

	function onChange(event: SyntheticInputEvent<>) {
		const select = event.target
		const sortField =
			select && props.sortFields.find(s => s.Id === select.value)
		if (sortField) {
			props.onSelectSortField(sortField)
		}
	}

	return (
		<label className="slds-form-element slds-grid slds-grid_vertical-align-center slds-p-vertical_xx-small">
			<span className="slds-form-element__label slds-col slds-size_1-of-6">
				Sort by
			</span>
			<div className="slds-form-element__control slds-col">
				<select
					className="slds-select select-sort-field"
					onChange={onChange}
					value={selectedId}
				>
					{options}
				</select>
			</div>
		</label>
	)
}

function AccountCards({
	accounts,
	fieldSet
}: {
	accounts: ?(Account[]),
	fieldSet: FieldSet
}) {
	return accounts
		? accounts.map(record => (
				<AccountCard
					key={record.attributes.url}
					fieldSet={fieldSet}
					record={record}
				/>
		  ))
		: []
}

function Pagination(props: {
	currentPage: number,
	onSelectPage(p: number): any,
	pageCount: ?number
}) {
	const { currentPage, onSelectPage, pageCount } = props
	if (typeof pageCount !== "number") {
		return null
	}
	function prev(event) {
		event.preventDefault()
		onSelectPage(currentPage - 1)
	}
	function next(event) {
		event.preventDefault()
		onSelectPage(currentPage + 1)
	}
	return (
		<footer className="pagination slds-p-around--medium">
			<Button
				disabled={currentPage <= 1}
				label="Prev"
				onClick={prev}
				className="previousPage"
			/>
			<span>
				Page {currentPage} of {pageCount}
			</span>
			<Button
				disabled={currentPage >= pageCount}
				label="Next"
				onClick={next}
				className="nextPage"
			/>
		</footer>
	)
}
