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
import { getDefaultValues } from "../models/Layout"
import "./EditEvent.css"
import { FIELD_REQUIRED } from "./i18n/errorMessages"
import { Label, WithLabels } from "./i18n/Label"
import SObjectForm from "./SObjectForm"

type Props = {
	singleColumn?: boolean,
	spinner?: string // path to spinner image
}

export default function EditEvent(props: Props) {
	return (
		<Subscribe to={[Events]}>
			{events => <EventForm {...props} events={events} />}
		</Subscribe>
	)
}

function EventForm({ events, spinner, singleColumn }: *) {
	const description = events.getEventDescription()
	const layout = events.getEventLayout()
	if (!description || !layout) {
		return null
	}
	const { eventCreateFieldSet, eventDraft } = events.state
	const initialValues = {
		...getDefaultValues(description, layout, eventCreateFieldSet),
		...eventDraft
	}
	return (
		<Formik
			enableReinitialize={false}
			initialValues={initialValues}
			onSubmit={async (values, actions) => {
				delete values.searchTerm;
				await events.setEventDraft(values)
				await events.saveDraft()
				actions.setSubmitting(false)
				// TODO:
				// actions.setErrors(submissionerrors)
			}}
			validate={(values, props) => {
				const errors = {}
				for (const { name, required } of eventCreateFieldSet) {
					const value = values[name]
					if (required && (value === "" || value == null)) {
						errors[name] = FIELD_REQUIRED
					}
				}
				return errors
			}}
			render={formikProps => (
				<React.Fragment>
					<EventModal
						{...formikProps}
						singleColumn={singleColumn}
						events={events}
						spinner={spinner}
					/>
					<ConfirmDeleteDialog events={events} />
				</React.Fragment>
			)}
		/>
	)
}

function EventModal({
	singleColumn,
	errors,
	events,
	handleSubmit,
	isSubmitting,
	values,
	spinner
}: {
	singleColumn: boolean,
	errors: { [field: string]: string },
	events: Events,
	handleSubmit: (e: SyntheticEvent<any>) => void,
	isSubmitting: boolean,
	values: Object,
	spinner: ?string
}) {
	const description = events.getEventDescription()
	const layout = events.getEventLayout()
	const { eventCreateFieldSet, eventDraft } = events.state
	
	const contacts = events.getContacts(values.searchTerm);
	if (!description || !layout) {
		return null
	}
	return (
		<WithLabels>
			{label => (
				<Modal
					containerClassName={["event-form-modal"]}
					contentClassName={[
						"event-form-modal-content",
						"slds-p-around--medium"
					]}
					directional={true} // puts "Delete" on the left
					footer={[
						events.isEditingEvent() ? (
							<Button
								key="delete-button"
								label={label("Delete_Event")}
								onClick={() => {
									// Sets state to open confirmation dialog.
									events.beginDeleteEvent()
								}}
								variant="base"
							/>
						) : (
							// empty span so "Cancel" does not move to left
							<span key="delete-button-placeholder" />
						),
						events.isLoading() ? (
							<img
								alt={label("Loading")}
								className="loading-spinner"
								key="loading-spinner"
								src={spinner}
							/>
						) : null,
						<Button
							key="cancel-button"
							label={label("Cancel_Editing")}
							onClick={() => {
								events.discardEventDraft()
							}}
							disabled={isSubmitting}
						/>,
						<Button
							key="save-button"
							label={label("Save_Event")}
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
						singleColumn={singleColumn}
						description={description}
						errors={errors}
						fieldSet={toggleTimeInputs(
							Boolean(values.IsAllDayEvent),
							eventCreateFieldSet
						)}
						getReference={fieldName =>
							events.getReference(fieldName, eventDraft && eventDraft.Id)
						}
						layout={layout}
						timezone={events.state.timezone}
						contacts={contacts}
					/>
				</Modal>
			)}
		</WithLabels>
	)
}

function ConfirmDeleteDialog({ events }: { events: Events }) {
	const cancelDelete = () => events.cancelDeleteEvent()
	return (
		<WithLabels>
			{label => (
				<Modal
					dismissable={false}
					footer={[
						<Button
							key="cancel-button"
							label={label("Cancel_Delete")}
							onClick={cancelDelete}
						/>,
						<Button
							key="save-button"
							label={label("Confirm_Delete")}
							variant="destructive"
							onClick={() => {
								events.deleteEvent()
							}}
						/>
					]}
					isOpen={events.state.awaitingConfirmDelete}
					onRequestClose={cancelDelete}
					prompt="warning"
					title={<Label>Are_You_Sure</Label>}
				>
					<div className="confirm-delete-content slds-m-around_medium">
						<Label>Event_Will_Be_Deleted</Label>
					</div>
				</Modal>
			)}
		</WithLabels>
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
