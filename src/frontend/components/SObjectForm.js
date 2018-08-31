/* @flow strict */

import classNames from "classnames"
import { Field, Form } from "formik"
import * as React from "react"
import * as FS from "../models/FieldSet"
import { type Layout, getPicklistValues } from "../models/Layout"
import { type Record } from "../models/QueryResult"
import { type SObjectDescription } from "../models/SObjectDescription"
import Checkbox from "./forms/Checkbox"
import Combobox from "./forms/Combobox"
import DateTime from "./forms/DateTime"
import { getErrorText } from "./i18n/errorMessages"

type Errors = { [key: string]: string }

type Props = {
	description: SObjectDescription, // description may be loading when form renders
	errors?: ?Errors,
	fieldSet: FS.FieldSet,
	getReference?: (fieldName: string) => ?Record,
	layout: Layout,
	timezone: string
}

export default function SObjectForm({
	description,
	errors,
	fieldSet,
	getReference,
	layout,
	timezone
}: Props) {
	return (
		<Form className="slds-form slds-form_stacked">
			{inputsForFieldSet(
				fieldSet,
				errors,
				description,
				getReference,
				layout,
				timezone
			)}
		</Form>
	)
}

// Get fields in pairs, and arrange inputs in a two-column grid
function inputsForFieldSet(
	fieldSet: FS.FieldSet,
	errors: ?Errors,
	description: SObjectDescription,
	getReference: ?(fieldName: string) => ?Record,
	layout: Layout,
	timezone: string
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
						{inputFor(
							field,
							errors && errors[field.name],
							description,
							getReference,
							layout,
							timezone
						)}
					</div>
				))}
			</div>
		)
	}
	return inputs
}

function FormElement(props: {
	children: React.Node,
	errorMessage?: ?string,
	label: string,
	required?: boolean
}) {
	const requiredAsterisk = props.required ? (
		<abbr className="slds-required" title="required">
			*
		</abbr>
	) : null
	return (
		<div
			className={classNames("slds-form-element", "slds-p-vertical_xx-small", {
				"slds-has-error": Boolean(props.errorMessage)
			})}
		>
			<label>
				<span className="slds-form-element__label">
					{requiredAsterisk}
					{props.label}
				</span>
				<div className="slds-form-element__control">{props.children}</div>
				{props.errorMessage ? (
					<div className="slds-form-element__help">
						{getErrorText(props.errorMessage)}
					</div>
				) : null}
			</label>
		</div>
	)
}

function inputFor(
	{ label, name, required, type }: FS.Field,
	errorMessage: ?string,
	description: SObjectDescription,
	getReference: ?(fieldName: string) => ?Record,
	layout: Layout,
	timezone: string
): React.Node {
	switch (type) {
		case "boolean":
			return (
				<Checkbox
					className="slds-p-vertical_xx-small"
					errorText={getErrorText(errorMessage)}
					label={label}
					name={name}
					required={required}
				/>
			)
		case "combobox":
			const options = getPicklistValues(description, layout, name) || []
			return (
				<Combobox
					classNameContainer="slds-p-vertical_xx-small"
					errorText={getErrorText(errorMessage)}
					label={label}
					name={name}
					options={options}
					required={required}
				/>
			)
		case "date":
			return (
				<DateTime
					containerClassName="slds-p-vertical_xx-small"
					label={label}
					name={name}
					showTime={false}
					required={required}
					timezone={timezone}
				/>
			)
		case "datetime":
			return (
				<DateTime
					containerClassName="slds-p-vertical_xx-small"
					label={label}
					name={name}
					required={required}
					timezone={timezone}
				/>
			)
		case "picklist":
			const values = getPicklistValues(description, layout, name) || []
			return (
				<FormElement
					errorMessage={errorMessage}
					label={label}
					required={required}
				>
					<Field className="slds-select" component="select" name={name}>
						{values.map(({ label, value }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</Field>
				</FormElement>
			)
		case "reference":
			const record = getReference && getReference(name)
			const href = record && hrefFromApiUrl(record.attributes.url)
			const address = record &&
				record.BillingAddress && <Address {...record.BillingAddress} />
			return (
				<div className="slds-form-element slds-p-vertical_xx-small">
					<span className="slds-form-element__label">{label}</span>
					<div className="slds-form-element__control">
						{record ? <a href={href}>{record.Name}</a> : "-"}
						<br />
						{address || null}
					</div>
				</div>
			)
		case "textarea":
			return (
				<FormElement
					errorMessage={errorMessage}
					label={label}
					required={required}
				>
					<Field className="slds-textarea" component="textarea" name={name} />
				</FormElement>
			)
		default:
			return (
				<FormElement
					errorMessage={errorMessage}
					label={label}
					required={required}
				>
					<Field className="slds-input" type="text" name={name} />
				</FormElement>
			)
	}
}

function Address({ city, country, postalCode, state, street }: FS.Address) {
	return (
		<span>
			{street}
			<br />
			{city}, {state} {postalCode}
			<br />
			{country}
		</span>
	)
}

const hrefPattern = /\/[A-Za-z_-]+\/[^/]+$/
function hrefFromApiUrl(url: string): ?string {
	const matches = url.match(hrefPattern)
	if (matches) {
		return `/lightning/r${matches[0]}/view`
	}
}
