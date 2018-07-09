/*
 * Text input with given set of completion options, for use in a form managed by
 * formik. Comes with a `label` element.
 *
 * @flow strict
 */

import Downshift, {
	type ControllerStateAndHelpers as DownshiftState
} from "downshift"
import { Field } from "formik"
import * as React from "react"

type Props = {
	label: string,
	name: string,
	suggestions: string[]
}

export default function Autocomplete(props: Props) {
	return (
		<Field
			name={props.name}
			render={({ field, form }) => (
				<Downshift
					selectedItem={field.value}
					itemToString={id}
					onStateChange={({ inputValue, selectedItem }) => {
						// Update parent form state when the user enters any
						// value - even if it is not one of the given
						// suggestions.
						//
						// When the user selects a completion the `selectedItem`
						// value is given here.
						if (typeof selectedItem !== "undefined") {
							form.setFieldValue(props.name, selectedItem)
							// When the user enters text into the input, the
							// `inputValue` value is given.
						} else if (typeof inputValue !== "undefined") {
							form.setFieldValue(props.name, inputValue)
						}
					}}
				>
					{(state: DownshiftState<string>) => (
						<div>
							<label {...state.getLabelProps()}>{props.label}:</label>{" "}
							<input
								type="text"
								name={props.name}
								{...state.getInputProps({
									onBlur: field.onBlur,
									onFocus() {
										state.openMenu()
									}
								})}
							/>
							<ul {...state.getMenuProps()}>
								{state.isOpen ? menuItems(props, state) : null}
							</ul>
						</div>
					)}
				</Downshift>
			)}
		/>
	)
}

function menuItems(props: Props, state: DownshiftState<string>): React.Node {
	return matchingSuggestions(props, state.inputValue).map((item, index) => (
		<li
			{...state.getItemProps({
				key: item,
				index,
				item,
				style: {
					backgroundColor:
						state.highlightedIndex === index ? "lightgray" : "white",
					fontWeight: state.selectedItem === item ? "bold" : "normal"
				}
			})}
		>
			{item}
		</li>
	))
}

function matchingSuggestions({ suggestions }: Props, input: ?string): string[] {
	if (!input) {
		return suggestions
	}
	const inputLower = input.toLowerCase()
	return suggestions.filter(
		s => s !== input && s.toLowerCase().includes(inputLower)
	)
}

function id<T>(x: T): T {
	return x
}
