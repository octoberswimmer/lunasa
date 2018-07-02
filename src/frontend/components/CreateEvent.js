/* @flow strict */

import { Field, Form, Formik } from "formik"
import * as React from "react"
import { Subscribe } from "unstated"
import Events from "../containers/Events"
import DateTime from "./DateTime"

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
								<label>
									Subject: <Field type="text" name="Subject" />
								</label>
								<br />
								<label>
									Start: <DateTime name="StartDateTime" />
								</label>
								<br />
								<label>
									End: <DateTime name="EndDateTime" />
								</label>
								<br />
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
