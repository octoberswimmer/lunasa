/* @flow strict */

import React, { Component } from "react"
import "./App.css"
import FullCalendar from "./FullCalendar"

interface Props {}

class App extends Component<Props> {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">Lunasa</h1>
				</header>
				<FullCalendar />
			</div>
		)
	}
}

export default App
