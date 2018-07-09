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
import "./EditEvent.css"
import SObjectForm from "./SObjectForm"

type Props = {
	spinner?: string // path to spinner image
}

export default function EditEvent(props: Props) {
	return (
		<Subscribe to={[Events]}>
			{events => {
				events.fetchEventDescription()
				const { eventDraft } = events.state
				const title = events.isCreatingEvent()
					? "New Event"
					: `Edit ${(eventDraft && eventDraft.Subject) || "Event"}`
				return (
					<Formik
						enableReinitialize={false}
						initialValues={events.state.eventDraft}
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
											alt="Loading..."
											className="loading-spinner"
											key="loading-spinner"
											src={props.spinner}
										/>
									) : null,
									<Button
										key="cancel-button"
										label="Cancel"
										onClick={() => {
											events.discardEventDraft()
										}}
										disabled={isSubmitting}
									/>,
									<Button
										key="save-button"
										label="Save"
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
								title={title}
							>
								<SObjectForm
									description={events.state.eventDescription}
									fieldSet={events.state.eventCreateFieldSet}
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
