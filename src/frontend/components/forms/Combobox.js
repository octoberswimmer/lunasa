/*
 * SLDS Combobox input that is managed by formik. This is a specialized version
 * of the Combobox input where selecting an item populates the value of the text
 * input, as opposed to putting a "pill" in or below the input.
 *
 * @flow strict
 */

import SLDSCombobox from "@salesforce/design-system-react/components/combobox"
import filter from "@salesforce/design-system-react/components/combobox/filter"
import { Field } from "formik"
import * as React from "react"
import { type PickListValue } from "../../models/SObjectDescription"

// Additional props are passed through to `SLDSCombobox`
type Props = {
	label: string,
	name: string,
	options: PickListValue[]
}

export default function Combobox(props: Props) {
	const { label, name, options, ...rest } = props
	return (
		<Field
			name={name}
			render={({ field, form }) => (
				<SLDSCombobox
					events={{
						onBlur() {
							form.setFieldTouched(name, true)
						},
						onChange(event, { value }) {
							form.setFieldValue(name, value)
						},
						onSelect(event, { selection }: { selection: PickListValue[] }) {
							const option = selection[0]
							if (option) {
								form.setFieldValue(name, option.value)
							}
						}
					}}
					labels={{ label }}
					options={filter({
						inputValue: field.value || "",
						options: options.map(addId),
						selection: [field.value].filter(isTruthy)
					})}
					value={field.value || ""}
					variant="inline-listbox"
					{...rest}
				/>
			)}
		/>
	)
}

function addId(
	obj: PickListValue
): { id: string, label: string, value: string } {
	return {
		...obj,
		id: obj.value
	}
}

function isTruthy(x: mixed): boolean {
	return !!x
}
