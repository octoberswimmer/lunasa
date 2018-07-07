/* @flow strict */

import Toast from "@salesforce/design-system-react/components/toast"
import ToastContainer from "@salesforce/design-system-react/components/toast/container"
import React from "react"
import { Subscribe } from "unstated"
import Accounts from "../containers/Accounts"
import Events from "../containers/Events"
import { forFullcalendar, newEvent } from "../models/Event"
import "./App.css"
import AccountList from "./AccountList"
import CreateEvent from "./CreateEvent"
import DroppableCalendar from "./DroppableCalendar"

type Props = {}

const options = {
	// Toolbar controls to be displayed in calendar header
	header: {
		left: "title",
		right: "basicWeek,month today prev,next"
	},
	height: "auto"
}

export default function App(props: Props) {
	return (
		<Subscribe to={[Accounts, Events]}>
			{(accounts, events) => {
				const isLoading = accounts.isLoading() || events.isLoading()
				return (
					<div className="App">
						{isLoading ? "Loading..." : null}
						<ToastContainer>
							<Errors container={accounts} />
							<Errors container={events} />
						</ToastContainer>
						<div className="main">
							<AccountList
								className="accounts"
								fieldSet={accounts.state.accountFieldSet}
							/>
							<DroppableCalendar
								className="calendar"
								events={events.state.events.map(forFullcalendar)}
								onDrop={({ accountUrl, date }) => {
									const account = accounts.getAccount(accountUrl)
									if (account) {
										const draft = newEvent({ account, date })
										events.newEvent(draft)
									}
								}}
								options={{
									...options,
									viewRender(view) {
										events.getEventsByDateRange(view.start, view.end)
									}
								}}
							/>
							{events.state.newEvent ? <CreateEvent /> : null}
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

function Errors({ container }: { container: ErrorReporter }) {
	return container
		.getErrors()
		.map((e, i) => (
			<Toast
				key={i}
				labels={{ heading: e.message }}
				onRequestClose={() => container.dismissError(e)}
				variant="error"
			/>
		))
}
