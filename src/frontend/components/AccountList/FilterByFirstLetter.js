/* @flow strict */

import Button from "@salesforce/design-system-react/components/button"
import classNames from "classnames"
import * as React from "react"
import { getAlphabetCollapsed } from "../../locale"
import * as F from "../../models/Filter"
import { Label } from "../i18n/Label"
import "./FilterByFirstLetter.css"

type Props = {
	filters: F.Filter[],
	locale: string,
	onApplyFilter(filter: F.Filter): void
}

export default function FilterByFirstLetter({
	filters,
	locale,
	onApplyFilter
}: Props) {
	const selectedLetter = F.filterByLetter(filters)
	const chars = getAlphabetCollapsed(locale).map(char => (
		<Button
			className={classNames("filterLetter", {
				selected: selectedLetter === char
			})}
			onClick={() => {
				onApplyFilter(F.firstLetter(char))
			}}
			key={char}
			variant="base"
		>
			{char.toLocaleUpperCase()}
		</Button>
	))
	const other = (
		<Button
			className={classNames("filterLetter", {
				selected: F.filterByLetterOther(filters)
			})}
			onClick={() => {
				onApplyFilter(F.firstLetterOther())
			}}
			key="Other"
			variant="base"
		>
			<Label>Other</Label>
		</Button>
	)
	const any = (
		<Button
			className={classNames("filterLetter", {
				selected: F.filterByLetterAny(filters)
			})}
			onClick={() => {
				onApplyFilter(F.firstLetterAny())
			}}
			key="All"
			variant="base"
		>
			<Label>All</Label>
		</Button>
	)
	return (
		<span
			className={classNames(
				"filterLetters",
				"slds-grid",
				"slds-grid_vertical-align-center",
				"slds-p-vertical_xx-small"
			)}
		>
			{[...chars, other, any]}
		</span>
	)
}
