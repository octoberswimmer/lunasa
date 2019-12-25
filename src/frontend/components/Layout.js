/* @flow strict */

import * as React from "react"
import { Label } from "./i18n/Label"
import Events from "../containers/Events"
import { Subscribe } from "unstated"
import { type RecordTypeInfo } from "../models/RecordType"

type Props = {
	eventRecordTypeInfos: RecordTypeInfo[]
}

export default function Layout(props: Props) {
	return (
		<Subscribe to={[Events]}>
			{events => {
				const options = props.eventRecordTypeInfos
					.filter(({ active, available }) => active && available)
					.map(({ recordTypeId, name, defaultRecordTypeMapping }) => (
						<option
							value={recordTypeId}
							key={recordTypeId}
							defaultValue={defaultRecordTypeMapping}
						>
							{name}
						</option>
					))

				function changeLayout(event: SyntheticInputEvent<>) {
					const recordTypeId = event.target.value
					const recordType = props.eventRecordTypeInfos.find(
						e => e.recordTypeId === recordTypeId
					)

					if (recordType) {
						events.setEventLayout(recordType)
					}
				}

				if (options.length > 1) {
					return (
						<label className="slds-form-element slds-grid slds-grid_vertical-align-center slds-p-vertical_xx-small">
							<span className="slds-form-element__label slds-col slds-grow-none">
								<Label>Layout_by</Label>
							</span>
							<div className="slds-form-element__control slds-col">
								<select
									className="slds-select select-sort-field"
									onChange={changeLayout}
								>
									{options}
								</select>
							</div>
						</label>
					)
				}

				return <div></div>
			}}
		</Subscribe>
	)
}
