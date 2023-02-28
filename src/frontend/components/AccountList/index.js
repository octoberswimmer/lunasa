/* @flow strict */

import Button from "@salesforce/design-system-react/components/button"
import classNames from "classnames"
import * as React from "react"
import { Subscribe } from "unstated"
import Accounts, {
	type ListViewLike,
	GIVEN_IDS
} from "../../containers/Accounts"
import { type Account } from "../../models/Account"
import { type FieldSet } from "../../models/FieldSet"
import {
	type SortDirection,
	type SortField,
	ASCENDING,
	DESCENDING
} from "../../models/SortField"
import AccountCard from "../AccountCard"
import { Label, WithLabels } from "../i18n/Label"
import "./AccountList.css"
import FilterByFirstLetter from "./FilterByFirstLetter"
import Search from "./Search"

type Props = {
	className?: string | string[],
	debounceInterval?: number,
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
							<LoadingSpinner spinner={props.spinner} />
						) : null}
					</div>
					<FilterByFirstLetter
						filters={accounts.state.filters}
						locale={accounts.state.locale}
						selectedSortField={accounts.state.selectedSortField}
						fieldDefinitions={accounts.state.fieldDefinitions}
						onApplyFilter={filter => {
							accounts.applyFilter(filter)
						}}
					/>
					<Search
						debounceInterval={props.debounceInterval}
						filters={accounts.state.filters}
						onApplyFilter={filter => {
							accounts.applyFilter(filter)
						}}
					/>
					<SelectSortField
						onSelectSortDirection={dir => {
							accounts.selectSortDirection(dir)
						}}
						onSelectSortField={sortField => {
							accounts.selectSortField(sortField)
						}}
						selected={accounts.state.selectedSortField}
						sortDirection={accounts.state.sortDirection}
						sortFields={accounts.state.sortFields}
					/>
					<div className="account-card-list">
						<AccountCards
							accounts={accounts.getAccounts()}
							fieldSet={props.fieldSet}
							account={accounts}
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
		return (
			<WithLabels>
				{label => {
					const { listViews } = this.props
					const listViewOptions = listViews
						? listViews.map(view => (
								<option value={view.id} key={view.id}>
									{view.id === GIVEN_IDS
										? label("Selected_Accounts")
										: view.label}
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
				}}
			</WithLabels>
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

function SelectSortField(props: {
	onSelectSortDirection(dir: SortDirection): void,
	onSelectSortField(s: SortField): void,
	selected?: ?SortField,
	sortDirection: SortDirection,
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

	function onToggleSortDirection(event: SyntheticEvent<>) {
		const newDir = [ASCENDING, DESCENDING].filter(
			dir => dir !== props.sortDirection
		)[0]
		props.onSelectSortDirection(newDir)
	}

	return (
		<label className="slds-form-element slds-grid slds-grid_vertical-align-center slds-p-vertical_xx-small">
			<span className="slds-form-element__label slds-col slds-grow-none">
				<Label>Sort_by</Label>
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
			<span className="slds-col slds-grow-none">
				<Button
					assistiveText={<Label>Toggle_Sort_Direction</Label>}
					className="toggle-sort-direction"
					iconCategory="utility"
					iconName={
						props.sortDirection === DESCENDING ? "arrowdown" : "arrowup"
					}
					iconVariant="border"
					onClick={onToggleSortDirection}
					variant="icon"
				/>
			</span>
		</label>
	)
}

function AccountCards({
	accounts,
	fieldSet,
	account
}: {
	accounts: ?(Account[]),
	fieldSet: FieldSet,
	account : Accounts
}) {
	return accounts
		? accounts.map(record => (
				<AccountCard
					key={record.attributes.url}
					fieldSet={fieldSet}
					record={record}
					account={account}
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
				label={<Label>Previous_Page</Label>}
				onClick={prev}
				className="previousPage"
			/>
			<span>
				<Label with={{ current: currentPage, total: pageCount }}>
					Page_Number_With_Page_Count
				</Label>
			</span>
			<Button
				disabled={currentPage >= pageCount}
				label={<Label>Next_Page</Label>}
				onClick={next}
				className="nextPage"
			/>
		</footer>
	)
}

function LoadingSpinner({ spinner }: { spinner: ?string }) {
	return (
		<WithLabels>
			{label => (
				<img alt={label("Loading")} className="loading-spinner" src={spinner} />
			)}
		</WithLabels>
	)
}
