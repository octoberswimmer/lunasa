/*
 * This is the entry point for the frontend React app. Other frontend source
 * files are under `src/frontend/`
 *
 * @flow strict
 */
import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./frontend/App"
import registerServiceWorker from "./frontend/registerServiceWorker"

const elem = document.getElementById("root")
if (elem) {
	ReactDOM.render(<App />, elem)
	registerServiceWorker()
} else {
	throw new Error("Unable to locate mount point for React app in DOM")
}
