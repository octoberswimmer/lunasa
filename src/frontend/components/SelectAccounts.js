/* @flow strict */

import * as React from "react"
import { type Account } from "../models/Account"
import { type FieldSet } from "../models/FieldSet"
import { type ListView, type ListViews } from "../models/ListView"
import AccountCard from "./AccountCard"

type Props = {
	accounts: ?(Account[]),
	className?: string,
	fieldSet: FieldSet,
	listViews: ?ListViews,
	onSelectListView(listView: ListView): void
}

export default class SelectAccounts extends React.Component<Props> {
	onInput: (event?: SyntheticInputEvent<>) => void;
	select: { current: null | React.ElementRef<"select"> }

	constructor(props: Props) {
		super(props)
		this.onInput = this.onInput.bind(this)
		this.select = React.createRef()
	}

	componentDidUpdate(prevProps: Props) {
		// Trigger fetch for accounts from the first list view when list views
		// load.
		if (!prevProps.listViews) {
			this.onInput()
		}
	}

	render() {
		const { accounts, className, fieldSet, listViews } = this.props
		const listViewOptions = listViews
			? listViews.listviews.map(view => (
					<option value={view.id} key={view.id}>
						{view.label}
					</option>
			  ))
			: []
		const accountCards = accounts
			? accounts.map(record => (
					<AccountCard
						key={record.attributes.url}
						fieldSet={fieldSet}
						record={record}
					/>
			  ))
			: []
		return (
			<div className={className || ""}>
				<select onInput={this.onInput} ref={this.select}>{listViewOptions}</select>
				{accountCards}
			</div>
		)
	}

	onInput(event?: SyntheticInputEvent<>) {
		const { onSelectListView, listViews } = this.props
		const select = this.select.current
		if (!select || !listViews) {
			return
		}
		const listViewId = select.value
		const listView = listViews.listviews.filter(view => view.id === listViewId)[0]
		if (listView) {
			onSelectListView(listView)
		}
	}
}
