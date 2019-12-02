/* @flow strict */

import Button from "@salesforce/design-system-react/components/button"
import classNames from "classnames"
import * as React from "react"
import { getAlphabetCollapsed } from "../../locale"
import * as F from "../../models/Filter"
import { Label } from "../i18n/Label"
import "./FilterByFirstLetter.css"
import { type SortField, isStringFilter } from "../../models/SortField"
import { type FieldDefinition } from "../../models/FieldDefinition"

type Props = {
	filters: F.Filter[],
	locale: string,
	onApplyFilter(filter: F.Filter): void,
	fieldDefinitions?: FieldDefinition[],
	selectedSortField?: ?SortField
}

export default function FilterByFirstLetter({
	filters,
	locale,
	onApplyFilter,
	fieldDefinitions,
	selectedSortField
}: Props) {
	const toggleAlphabet =
		fieldDefinitions &&
		selectedSortField &&
		isStringFilter(fieldDefinitions, selectedSortField)
			? ""
			: "hidden"
	const selectedLetter = F.isFilteredByLetter(filters)
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
				selected: F.isFilteredByLetterOther(filters)
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
				selected: F.isFilteredByLetterAny(filters)
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
				"slds-p-vertical_xx-small",
				toggleAlphabet
			)}
		>
			{[...chars, other, any]}
		</span>
	)
}
