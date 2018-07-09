/* @flow strict */

import { Field, Form } from "formik"
import * as React from "react"
import * as FS from "../models/FieldSet"
import {
	type SObjectDescription,
	getPicklistValues
} from "../models/SObjectDescription"
import Combobox from "./forms/Combobox"
import DateTime from "./forms/DateTime"

type Props = {
	description: ?SObjectDescription, // description may be loading when form renders
	fieldSet: FS.FieldSet
}

export default function SObjectForm({ description, fieldSet }: Props) {
	return (
		<Form className="slds-form slds-form_stacked">
			{inputsForFieldSet(fieldSet, description)}
		</Form>
	)
}

// Get fields in pairs, and arrange inputs in a two-column grid
function inputsForFieldSet(
	fieldSet: FS.FieldSet,
	description: ?SObjectDescription
): React.Node {
	const inputs = []
	for (let i = 0; i < fieldSet.length; i += 2) {
		const fields = fieldSet.slice(i, i + 2)
		inputs.push(
			<div
				key={fields.map(field => field.name).join("-")}
				className="slds-grid"
			>
				{fields.map(field => (
					<div
						className="slds-has-flexi-truncate slds-p-horizontal_medium"
						key={field.name}
					>
						{inputFor(field, description)}
					</div>
				))}
			</div>
		)
	}
	return inputs
}

function FormElement(props: { children: React.Node, label: string }) {
	return (
		<div className="slds-form-element slds-p-vertical_xx-small">
			<label>
				<span className="slds-form-element__label">{props.label}</span>
				<div className="slds-form-element__control">{props.children}</div>
			</label>
		</div>
	)
}

function inputFor(
	{ label, name, type }: FS.Field,
	description: ?SObjectDescription
): React.Node {
	switch (type) {
		case "boolean":
			return (
				<FormElement label={label}>
					<Field type="checkbox" name={name} />
				</FormElement>
			)
		case "combobox":
			const options =
				(description && getPicklistValues(description, name)) || []
			return (
				<Combobox
					classNameContainer="slds-p-vertical_xx-small"
					label={label}
					name={name}
					options={options}
				/>
			)
		case "date":
			return (
				<DateTime
					containerClassName="slds-p-vertical_xx-small"
					label={label}
					name={name}
					showTime={false}
				/>
			)
		case "datetime":
			return (
				<DateTime
					containerClassName="slds-p-vertical_xx-small"
					label={label}
					name={name}
				/>
			)
		case "picklist":
			const values = (description && getPicklistValues(description, name)) || []
			return (
				<FormElement label={label}>
					<Field className="slds-select" component="select" name={name}>
						{values.map(({ label, value }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</Field>
				</FormElement>
			)
		case "textarea":
			return (
				<FormElement label={label}>
					<Field className="slds-textarea" component="textarea" name={name} />
				</FormElement>
			)
		default:
			return (
				<FormElement label={label}>
					<Field type="text" name={name} />
				</FormElement>
			)
	}
}
