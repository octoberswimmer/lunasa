/* @flow strict */

import React from "react"
import { Subscribe } from "unstated"
import Accounts from "../containers/Accounts"
import Events from "../containers/Events"
import { forFullcalendar } from "../models/Event"
import "./App.css"
import FullCalendar from "./FullCalendar"
import SelectAccounts from "./SelectAccounts"

interface Props {}

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
							<SelectAccounts
								className="accounts"
								listViews={accounts.state.listViews}
								onSelectListView={listView => {
									accounts.selectListView(listView)
								}}
								results={accounts.state.results}
							/>
							<FullCalendar
								className="calendar"
								events={events.state.events.map(forFullcalendar)}
								options={{
									...options,
									viewRender(view) {
										events.getEventsByDateRange(view.start, view.end)
									}
								}}
							/>
						</div>
					</div>
				)
			}}
		</Subscribe>
	)
}
