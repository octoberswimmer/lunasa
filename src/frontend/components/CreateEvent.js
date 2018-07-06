/* @flow strict */

import Button from "@salesforce/design-system-react/components/button"
import Modal from "@salesforce/design-system-react/components/modal"
import { Field, Form, Formik } from "formik"
import * as React from "react"
import { Subscribe } from "unstated"
import Events from "../containers/Events"
import * as FS from "../models/FieldSet"
import {
	type SObjectDescription,
	getPicklistValues
} from "../models/SObjectDescription"
import Combobox from "./forms/Combobox"
import DateTime from "./forms/DateTime"

type Props = {}

export default function CreateEvent(type: Props) {
	return (
		<Subscribe to={[Events]}>
			{events => {
				events.fetchEventDescription()
				return (
					<Formik
						enableReinitialize={false}
						initialValues={events.state.newEvent}
						onSubmit={async (values, actions) => {
							await events.newEvent(values)
							await events.create()
							actions.setSubmitting(false)
							// TODO:
							// actions.setErrors(submissionerrors)
						}}
						render={({ handleSubmit, isSubmitting, values }) => (
							<Modal
								footer={[
									<Button
										key="cancel-button"
										label="Cancel"
										onClick={() => {
											events.discardNewEvent()
										}}
										disabled={isSubmitting}
									/>,
									<Button
										key="save-button"
										label="Save"
										variant="brand"
										onClick={handleSubmit}
										disabled={isSubmitting}
									/>
								]}
								isOpen={true}
								onRequestClose={() => {
									events.discardNewEvent()
								}}
								title="New Event"
							>
								<Form className="slds-form slds-form_stacked slds-p-around--large">
									{inputsForFieldSet(
										events.state.eventCreateFieldSet,
										events.state.eventDescription
									)}
								</Form>
							</Modal>
						)}
					/>
				)
			}}
		</Subscribe>
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
				<FormElement label={label}>
					<DateTime name={name} timeFormat={false} />
				</FormElement>
			)
		case "datetime":
			return (
				<FormElement label={label}>
					<DateTime name={name} />
				</FormElement>
			)
		case "picklist":
			const values = (description && getPicklistValues(description, name)) || []
			return (
				<FormElement label={label}>
					<Field component="select" name={name}>
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
					<Field component="textarea" name={name} />
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
