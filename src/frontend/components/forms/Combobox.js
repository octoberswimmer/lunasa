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
import "./Combobox.css"

// Additional props are passed through to `SLDSCombobox`
type Props = {
	label: string,
	name: string,
	options: PickListValue[],
	required?: boolean
}

type State = {
	dirty: boolean,
	isOpen: boolean
}

export default class Combobox extends React.Component<Props, State> {
	state = {
		// `true` if field value has changed
		dirty: false,

		// Control `isOpen` state of completions dropdown so that we can hide
		// the dropdown when there are no completions to display.
		isOpen: false
	}

	combobox({ field, form }: { field: Object, form: Object }): React.Node {
		const { label, name, options, ...rest } = this.props
		const events = {
			onBlur: () => {
				form.setFieldTouched(name, true)
			},
			onChange: (event, { value }) => {
				const dirty = value !== field.value
				form.setFieldValue(name, value)
				this.setState(state => ({
					dirty,
					isOpen:
						state.isOpen &&
						applicableOptions(options, value, dirty || state.dirty).length > 0
				}))
			},
			// `onClose` is called on input blur, or on pressing
			// escape
			onClose: () => {
				this.setState({ isOpen: false })
			},
			// `onRequestClose` is called on a click outside the
			// input
			onRequestClose: () => {
				this.setState({ isOpen: false })
			},
			onRequestOpen: () => {
				// Open completions menu if there are completions to
				// display.
				this.setState(state => ({
					isOpen:
						applicableOptions(options, field.value, state.dirty).length > 0
				}))
			},
			onSelect: (event, { selection }: { selection: PickListValue[] }) => {
				const option = selection[0]
				if (option) {
					form.setFieldValue(name, option.label)
				}
			}
		}
		return (
			<SLDSCombobox
				events={events}
				isOpen={this.state.isOpen}
				labels={{ label, noOptionsFound: "" }}
				options={applicableOptions(options, field.value, this.state.dirty)}
				value={field.value || ""}
				variant="inline-listbox"
				{...rest}
			/>
		)
	}

	render() {
		const { name } = this.props
		return <Field name={name} render={formik => this.combobox(formik)} />
	}
}

function applicableOptions(
	options: PickListValue[],
	inputValue: ?string,
	dirty: boolean
) {
	// If the input value has not been edited then display all available
	// completions. This makes it easy to switch to another option if the
	// combobox is populated with a default value.
	return filter({
		inputValue: !inputValue || !dirty ? "" : inputValue,
		limit: 1000, // maximum number of picklist options supported by Salesforce
		options: options.map(addId),
		selection: [inputValue].filter(isTruthy)
	})
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
