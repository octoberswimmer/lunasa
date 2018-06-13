/* @flow strict */

import React from "react"
import { Subscribe } from "unstated"
import Events from "../containers/Events"
import { forFullcalendar } from "../models/Event"
import "./App.css"
import FullCalendar from "./FullCalendar"

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
		<Subscribe to={[Events]}>
			{container => (
				<div className="App">
					<header className="App-header">
						<h1 className="App-title">Lunasa</h1>
					</header>
					{container.isLoading() ? "Loading..." : null}
					{container.state.errors.length > 0
						? container.state.errors.map((e, i) => <p key={i}>{e.message}</p>)
						: null}
					<FullCalendar
						events={container.state.events.map(forFullcalendar)}
						options={{
							...options,
							viewRender(view) {
								container.getEventsByDateRange(view.start, view.end)
							}
						}}
					/>
				</div>
			)}
		</Subscribe>
	)
}
