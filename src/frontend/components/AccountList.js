/* @flow strict */

import * as React from "react"
import { Subscribe } from "unstated"
import Accounts from "../containers/Accounts"
import { type Account } from "../models/Account"
import { type FieldSet } from "../models/FieldSet"
import { type ListView, type ListViews } from "../models/ListView"
import AccountCard from "./AccountCard"
import "./AccountList.css"

type Props = {
	className?: string,
	fieldSet: FieldSet
}

export default function AccountList(props: Props) {
	return (
		<Subscribe to={[Accounts]}>
			{accounts => (
				<div className={props.className || ""}>
					<SelectAccountListView
						listViews={accounts.state.listViews}
						onSelectListView={listView => {
							accounts.selectListView(listView)
						}}
					/>
					<AccountCards
						accounts={accounts.getAccounts()}
						fieldSet={props.fieldSet}
					/>
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
	listViews: ?ListViews,
	onSelectListView(listView: ListView): void
}

class SelectAccountListView extends React.Component<SelectProps> {
	onInput: (event?: SyntheticInputEvent<>) => void
	select: { current: null | React.ElementRef<"select"> }

	constructor(props: SelectProps) {
		super(props)
		this.onInput = this.onInput.bind(this)
		this.select = React.createRef()
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
			? listViews.listviews.map(view => (
					<option value={view.id} key={view.id}>
						{view.label}
					</option>
			  ))
			: []
		return (
			<select onInput={this.onInput} ref={this.select}>
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
		const listView = listViews.listviews.filter(
			view => view.id === listViewId
		)[0]
		if (listView) {
			onSelectListView(listView)
		}
	}
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
		<div className="pagination">
			<button
				disabled={currentPage <= 1}
				onClick={prev}
				className="previousPage"
			>
				Prev
			</button>
			<span>
				Page {currentPage} of {pageCount}
			</span>
			<button
				disabled={currentPage >= pageCount}
				onClick={next}
				className="nextPage"
			>
				Next
			</button>
		</div>
	)
}
