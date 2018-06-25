/* @flow strict */

import React from "react"
import { Subscribe } from "unstated"
import Accounts from "../containers/Accounts"
import Events from "../containers/Events"
import { forFullcalendar, newEvent } from "../models/Event"
import "./App.css"
import AccountList from "./AccountList"
import CreateEvent from "./CreateEvent"
import DroppableCalendar from "./DroppableCalendar"
import Modal from "./Modal"

type Props = {}

const options = {
	// Toolbar controls to be displayed in calendar header
	header: {
		left: "title",
		right: "basicWeek,month today prev,next"
	}
}

export default function App(props: Props) {
	return (
		<Subscribe to={[Accounts, Events]}>
			{(accounts, events) => {
				const isLoading = accounts.isLoading() || events.isLoading()
				const errors = accounts.state.errors.concat(events.state.errors)
				return (
					<div className="App">
						<header className="App-header">
							<h1 className="App-title">Lunasa</h1>
						</header>
						{isLoading ? "Loading..." : null}
						{errors.length > 0
							? errors.map((e, i) => <p key={i}>{e.message}</p>)
							: null}
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
							{events.state.newEvent ? (
								<Modal
									onRequestClose={() => {
										events.discardNewEvent()
									}}
								>
									<CreateEvent />
								</Modal>
							) : null}
						</div>
					</div>
				)
			}}
		</Subscribe>
	)
}
