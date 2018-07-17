/* @flow strict */

import Toast from "@salesforce/design-system-react/components/toast"
import ToastContainer from "@salesforce/design-system-react/components/toast/container"
import classNames from "classnames"
import React from "react"
import unescape from "unescape"
import { Subscribe } from "unstated"
import Accounts from "../containers/Accounts"
import Events from "../containers/Events"
import { forFullcalendar, newEvent } from "../models/Event"
import "./App.css"
import AccountList from "./AccountList"
import DroppableCalendar from "./DroppableCalendar"
import EditEvent from "./EditEvent"

type Props = {
	spinner?: string // path to spinner image
}

export default function App(props: Props) {
	return (
		<Subscribe to={[Accounts, Events]}>
			{(accounts, events) => {
				const options = {
					// Toolbar controls to be displayed in calendar header
					header: {
						left: "title",
						right: "agendaWeek,month today prev,next"
					},
					height: "auto",
					timezone: "local",

					// `eventClick` is called when the user clicks on a calendar
					// event.
					eventClick(event) {
						const sfEvent = events.getEvent(event.id)
						if (sfEvent) {
							events.setEventDraft(sfEvent)
						}
					},

					// `eventDrop` is called when a calendar event is dragged
					// from a position on the calendar, and dropped on
					// a different date or time.
					eventDrop(event, delta) {
						events.updateStartEnd({
							eventId: event.id,
							startDelta: delta,
							endDelta: delta,
							isAllDay: !(event.start: any).hasTime()
						})
					},

					eventResize(event, delta) {
						events.updateStartEnd({ eventId: event.id, endDelta: delta })
					},

					// `viewRender` is called when the user switches between
					// month and week calendar views, or selects a different
					// date range to display.
					viewRender(view) {
						events.getEventsByDateRange(view.start, view.end)
					}
				}
				const isLoading = accounts.isLoading() || events.isLoading()
				return (
					<div className={classNames("App", { loading: isLoading })}>
						<ToastContainer>
							<Errors container={accounts} />
							<Errors container={events} />
						</ToastContainer>
						<div className="main">
							<AccountList
								className="accounts"
								fieldSet={accounts.state.accountFieldSet}
								spinner={props.spinner}
							/>
							<DroppableCalendar
								className="calendar"
								events={events.state.events.map(forFullcalendar)}
								onDrop={({ accountUrl, date }) => {
									// Called when an account card is dropped on
									// the calendar.
									const account = accounts.getAccount(accountUrl)
									if (account) {
										const draft = newEvent({ account, date })
										events.setEventDraft(draft)
									}
								}}
								options={options}
							/>
							{events.isCreatingEvent() || events.isEditingEvent() ? (
								<EditEvent spinner={props.spinner} />
							) : null}
						</div>
					</div>
				)
			}}
		</Subscribe>
	)
}

interface ErrorReporter {
	getErrors(): Error[];
	dismissError(error: Error): any;
}

// unescape error messages before rendering because Salesforce has already
// escaped special HTML characters.
function Errors({ container }: { container: ErrorReporter }) {
	return container
		.getErrors()
		.map((e, i) => (
			<Toast
				key={i}
				labels={{ heading: unescape(e.message) }}
				onRequestClose={() => container.dismissError(e)}
				variant="error"
			/>
		))
}
