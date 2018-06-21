/* @flow strict */

import * as React from "react"
import { type ListView, type ListViews, type Results } from "../models/ListView"
import AccountCard from "./AccountCard"

type Props = {
	className?: string,
	listViews: ?ListViews,
	onSelectListView(listView: ListView): void,
	results: ?Results
}

export default function SelectAccounts(props: Props) {
	const listViewOptions = props.listViews
		? props.listViews.listviews.map(view => (
				<option value={view.id} key={view.id}>
					{view.label}
				</option>
		  ))
		: []
	const accounts = props.results
		? props.results.records.map((record, idx) => (
			<AccountCard key={idx} columns={record.columns} />
		))
		: []
	return (
		<div className={props.className || ""}>
			<select onInput={onInput.bind(null, props)}>{listViewOptions}</select>
			{accounts}
		</div>
	)
}

function onInput({ onSelectListView, listViews }: Props, event: SyntheticInputEvent<>) {
	event.preventDefault()
	const listViewId = event.target.value
	if (!listViews) {
		return
	}
	const listView = listViews.listviews.filter(view => view.id === listViewId)[0]
	if (!listView) {
		return
	}
	onSelectListView(listView)
}
