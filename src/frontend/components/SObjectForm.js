/* @flow strict */

import classNames from "classnames"
import { Field, Form } from "formik"
import * as React from "react"
import * as FS from "../models/FieldSet"
import { type Layout, getPicklistValues } from "../models/Layout"
import { type Record } from "../models/QueryResult"
import {
	type SObjectDescription,
	type PickListValue
} from "../models/SObjectDescription"
import Checkbox from "./forms/Checkbox"
import { type RecordTypeInfo } from "../models/RecordType"
import Combobox from "./forms/Combobox"
import DateTime from "./forms/DateTime"
import { getErrorText } from "./i18n/errorMessages"

type Errors = { [key: string]: string }

type Props = {
	singleColumn?: boolean,
	description: SObjectDescription, // description may be loading when form renders
	errors?: ?Errors,
	fieldSet: FS.FieldSet,
	getReference?: (fieldName: string) => ?Record,
	layout: Layout,
	eventRecordTypeInfos: RecordTypeInfo[],
	timezone: string
}

const recordTypeFieldName = "RecordTypeId"

export default function SObjectForm({
	singleColumn,
	description,
	errors,
	fieldSet,
	getReference,
	layout,
	eventRecordTypeInfos,
	timezone
}: Props) {
	return (
		<Form className="slds-form slds-form_stacked">
			{inputsForFieldSet(
				singleColumn,
				fieldSet,
				errors,
				description,
				getReference,
				layout,
				timezone,
				eventRecordTypeInfos
			)}
		</Form>
	)
}

// Get fields and arrange inputs in a two-column (one if single column mode) grid
function inputsForFieldSet(
	singleColumn?: boolean,
	fieldSet: FS.FieldSet,
	errors: ?Errors,
	description: SObjectDescription,
	getReference: ?(fieldName: string) => ?Record,
	layout: Layout,
	timezone: string,
	eventRecordTypeInfos: RecordTypeInfo[]
): React.Node {
	const inputs = []
	const increment = singleColumn ? 1 : 2
	for (let i = 0; i < fieldSet.length; i += increment) {
		const fields = fieldSet.slice(i, i + increment)
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
							timezone,
							eventRecordTypeInfos
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
	timezone: string,
	eventRecordTypeInfos: RecordTypeInfo[]
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

			return picklistFor({ label, name, required, type }, errorMessage, values)
		case "reference":
			if (name === recordTypeFieldName) {
				const values = eventRecordTypeInfos
					.filter(
						({ active, available, master }) => active && available && !master
					)
					.map(({ recordTypeId, name, defaultRecordTypeMapping }) => ({
						active: true,
						defaultValue: defaultRecordTypeMapping,
						label: name,
						value: recordTypeId
					}))

				return picklistFor(
					{ label, name, required, type },
					errorMessage,
					values
				)
			}

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

function picklistFor(
	{ label, name, required }: FS.Field,
	errorMessage: ?string,
	values: PickListValue[]
) {
	return (
		<FormElement errorMessage={errorMessage} label={label} required={required}>
			<Field className="slds-select" component="select" name={name}>
				{values.map(({ label, value }) => (
					<option key={value} value={value}>
						{label}
					</option>
				))}
			</Field>
		</FormElement>
	)
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
