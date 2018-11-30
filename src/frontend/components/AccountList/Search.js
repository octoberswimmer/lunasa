/* @flow strict */

import debounce from "debounce"
import * as React from "react"
import * as F from "../../models/Filter"
import { Label } from "../i18n/Label"

type Props = {
	filters: F.Filter[],
	debounceInterval?: ?number,
	onApplyFilter(filter: F.Filter): void
}

export default function Search({
	filters,
	debounceInterval,
	onApplyFilter
}: Props) {
	const onChange = debounce(
		value => onApplyFilter(F.substring(value)),
		debounceInterval || 300
	)
	return (
		<label className="slds-form-element slds-grid slds-grid_vertical-align-center slds-p-vertical_xx-small">
			<span className="slds-form-element__label slds-col slds-grow-none">
				<Label>Search</Label>
			</span>
			<div className="slds-form-element__control slds-col">
				<input
					className="slds-input"
					type="text"
					name="search"
					onChange={event => onChange(event.target.value)}
				/>
			</div>
		</label>
	)
}
