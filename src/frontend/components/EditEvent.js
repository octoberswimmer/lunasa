/*
 * Create a new event, or edit an existing event.
 *
 * @flow strict
 */

import Button from "@salesforce/design-system-react/components/button"
import Modal from "@salesforce/design-system-react/components/modal"
import { Formik } from "formik"
import * as React from "react"
import { Subscribe } from "unstated"
import Events from "../containers/Events"
import { type FieldSet } from "../models/FieldSet"
import { getDefaultValues } from "../models/SObjectDescription"
import "./EditEvent.css"
import { Label } from "./i18n/Label"
import SObjectForm from "./SObjectForm"

type Props = {
	spinner?: string // path to spinner image
}

export default function EditEvent(props: Props) {
	return (
		<Subscribe to={[Events]}>
			{events => {
				const description = events.getEventDescription()
				if (!description) {
					return null
				}
				const { eventCreateFieldSet, eventDraft } = events.state
				const initialValues = {
					...getDefaultValues(description, eventCreateFieldSet),
					...eventDraft
				}
				return (
					<Formik
						enableReinitialize={false}
						initialValues={initialValues}
						onSubmit={async (values, actions) => {
							await events.setEventDraft(values)
							await events.saveDraft()
							actions.setSubmitting(false)
							// TODO:
							// actions.setErrors(submissionerrors)
						}}
						render={({ errors, handleSubmit, isSubmitting, values }) => (
							<Modal
								contentClassName={[
									"event-form-modal-content",
									"slds-p-around--medium"
								]}
								footer={[
									events.isLoading() ? (
										<img
											alt={<Label>Loading</Label>}
											className="loading-spinner"
											key="loading-spinner"
											src={props.spinner}
										/>
									) : null,
									<Button
										key="cancel-button"
										label={<Label>Cancel_Editing</Label>}
										onClick={() => {
											events.discardEventDraft()
										}}
										disabled={isSubmitting}
									/>,
									<Button
										key="save-button"
										label={<Label>Save_Event</Label>}
										variant="brand"
										onClick={handleSubmit}
										disabled={isSubmitting || hasErrors(errors)}
									/>
								]}
								isOpen={true}
								onRequestClose={() => {
									events.discardEventDraft()
								}}
								size="large"
								title={
									<Label
										with={{
											subject:
												typeof values.Subject === "string" ? (
													values.Subject
												) : (
													<Label>Event</Label>
												)
										}}
									>
										Edit_Event
									</Label>
								}
							>
								<SObjectForm
									description={description}
									fieldSet={toggleTimeInputs(
										Boolean(values.IsAllDayEvent),
										eventCreateFieldSet
									)}
									getReference={fieldName =>
										events.getReference(fieldName, eventDraft && eventDraft.Id)
									}
									timezone={events.state.timezone}
								/>
							</Modal>
						)}
					/>
				)
			}}
		</Subscribe>
	)
}

function hasErrors(errors: { [field: string]: string }): boolean {
	return Object.keys(errors).length > 0
}

/*
 * If "All-Day Event" is selected, show start and end date inputs as "date"
 * instead of "datetime" fields.
 */
function toggleTimeInputs(isAllDay: boolean, fieldSet: FieldSet): FieldSet {
	if (!isAllDay) {
		return fieldSet
	}
	return fieldSet.map(field => {
		if (field.name === "StartDateTime" || field.name === "EndDateTime") {
			return { ...field, type: "date" }
		} else {
			return field
		}
	})
}
