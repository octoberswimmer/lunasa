/*
 * This is the entry point for the frontend React app. Other frontend source
 * files are under `src/frontend/`
 *
 * @flow strict
 */
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "unstated"
import "./index.css"
import App from "./frontend/components/App"

const elem = document.getElementById("root")
if (elem) {
	ReactDOM.render(
		<Provider>
			<App />
		</Provider>,
		elem
	)
} else {
	throw new Error("Unable to locate mount point for React app in DOM")
}
