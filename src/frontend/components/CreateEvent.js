/* @flow strict */

import { Field, Form, Formik } from "formik"
import * as React from "react"
import { Subscribe } from "unstated"
import Events from "../containers/Events"
import * as FS from "../models/FieldSet"
import DateTime from "./forms/DateTime"

type Props = {}

export default function CreateEvent(type: Props) {
	return (
		<Subscribe to={[Events]}>
			{events => {
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
							<Form>
								{inputsForFieldSet(events.state.eventCreateFieldSet)}
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

function inputsForFieldSet(fieldSet: FS.FieldSet): React.Node {
	return fieldSet.map(field => (
		<label key={field.name}>
			{field.label}: {inputFor(field)}
			<br />
		</label>
	))
}

function inputFor({ name, type }: FS.Field): React.Node {
	switch (type) {
		case "boolean":
			return <Field type="checkbox" name={name} />
		case "date":
			return <DateTime name={name} timeFormat={false} />
		case "datetime":
			return <DateTime name={name} />
		case "textarea":
			return <Field component="textarea" name={name} />
		default:
			return <Field type="text" name={name} />
	}
}
