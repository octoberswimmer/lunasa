/* @flow strict */

import React, { Component } from "react"
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

class App extends Component<Props> {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">Lunasa</h1>
				</header>
				<FullCalendar options={options} />
			</div>
		)
	}
}

export default App
