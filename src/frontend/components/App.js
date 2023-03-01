/* @flow strict */

import Toast from "@salesforce/design-system-react/components/toast"
import ToastContainer from "@salesforce/design-system-react/components/toast/container"
import classNames from "classnames"
import * as fullcalendar from "fullcalendar"
import React from "react"
import unescape from "unescape"
import { Subscribe } from "unstated"
import Accounts from "../containers/Accounts"
import Events from "../containers/Events"
import { defaultTimedEventDuration } from "../models/Event"
import { hasTime } from "../util/moment"
import "./App.css"
import AccountList from "./AccountList"
import { getIdentifierFromDraggable } from "./Draggable"
import FullCalendar from "./FullCalendar"
import EditEvent from "./EditEvent"

type Props = {
	language?: ?string, // e.g. "en_US"
	spinner?: string, // path to spinner image
	weekends?: boolean,
	singleColumn?: boolean,
	minTime?: string,
	maxTime?: string,
	eventColor?: string,
	nextDayThreshold?: string
}

export default function App(props: Props) {
	return (
		<Subscribe to={[Accounts, Events]}>
			{(accounts, events) => {
				const options: any = {
					weekends: props.weekends,
					minTime: props.minTime,
					defaultView: "agendaWeek",
					droppable: true,
					// Toolbar controls to be displayed in calendar header
					header: {
						left: "title",
						right: "agendaWeek,month today prev,next"
					},
					height: "auto",
					eventColor: props.eventColor,
					nextDayThreshold: props.nextDayThreshold,
					timezone: false, // date values from calendar will be ambiguously-zoned

					// `drop` is called when an external draggable (e.g. an
					// account card) is dropped on the calendar.
					drop(date, event, ui, view) {
						const allDay =
							!hasTime(date) && !(view instanceof fullcalendar.MonthView)
						const data = getIdentifierFromDraggable(event.target)
						const account =
							data &&
							data.type === "Account" &&
							data.url &&
							accounts.getAccount(data.url)
						if (account) {
							const draft = events.newEvent({
								account,
								allDay,
								date
							})
							events.setEventDraft(draft, account)
						}
					},

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
						events.updateStartEnd({ calEvent: event, delta })
					},

					eventResize(event, delta) {
						events.updateEnd({ calEvent: event, delta })
					},

					// `viewRender` is called when the user switches between
					// month and week calendar views, or selects a different
					// date range to display.
					viewRender(view) {
						events.getEventsByDateRange(view.start, view.end)
					}
				}

				if (props.maxTime !== undefined && props.maxTime.length > 3) {
					options.maxTime = props.maxTime
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
							<FullCalendar
								className="calendar"
								defaultTimedEventDuration={defaultTimedEventDuration}
								events={events.getEventsForFullcalendar()}
								language={props.language}
								options={options}
							/>
							{events.isCreatingEvent() || events.isEditingEvent() ? (
								<EditEvent
									spinner={props.spinner}
									singleColumn={props.singleColumn}
								/>
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
