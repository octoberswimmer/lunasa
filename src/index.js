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

const elem = document.getElementById("root")
if (elem) {
	ReactDOM.render(<App />, elem)
} else {
	throw new Error("Unable to locate mount point for React app in DOM")
}
