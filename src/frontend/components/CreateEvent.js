/* @flow strict */

import { Field, Form, Formik } from "formik"
import * as React from "react"
import { Subscribe } from "unstated"
import Events from "../containers/Events"
import * as FS from "../models/FieldSet"
import {
	type SObjectDescription,
	getPicklistValues
} from "../models/SObjectDescription"
import Autocomplete from "./forms/Autocomplete"
import "./CreateEvent.css"
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
						render={({ isSubmitting, values }) => (
							<Form className="create-event-form">
								{inputsForFieldSet(
									events.state.eventCreateFieldSet,
									events.state.eventDescription
								)}
								<button type="submit" disabled={isSubmitting}>
									Create
								</button>
							</Form>
						)}
					/>
				)
			}}
		</Subscribe>
	)
}

function inputsForFieldSet(
	fieldSet: FS.FieldSet,
	description: ?SObjectDescription
): React.Node {
	return fieldSet.map(field => inputFor(field, description))
}

function inputFor(
	{ label, name, type }: FS.Field,
	description: ?SObjectDescription
): React.Node {
	switch (type) {
		case "boolean":
			return (
				<label key={name}>
					{label}: <Field type="checkbox" name={name} />
				</label>
			)
		case "combobox":
			const suggestions = (
				(description && getPicklistValues(description, name)) ||
				[]
			).map(item => item.value)
			return (
				<Autocomplete
					key={name}
					name={name}
					label={label}
					suggestions={suggestions}
				/>
			)
		case "date":
			return (
				<label key={name}>
					{label}: <DateTime name={name} timeFormat={false} />
				</label>
			)
		case "datetime":
			return (
				<label key={name}>
					{label}: <DateTime name={name} />
				</label>
			)
		case "picklist":
			const values = (description && getPicklistValues(description, name)) || []
			return (
				<label key={name}>
					{label}:{" "}
					<Field component="select" name={name}>
						{values.map(({ label, value }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</Field>
				</label>
			)
		case "textarea":
			return (
				<label key={name}>
					{label}: <Field component="textarea" name={name} />
				</label>
			)
		default:
			return (
				<label key={name}>
					{label}: <Field type="text" name={name} />
				</label>
			)
	}
}
