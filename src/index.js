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
import RestApi from "./frontend/api/RestApi"
import App from "./frontend/components/App"
import Accounts from "./frontend/containers/Accounts"
import { type FieldSet } from "./frontend/models/FieldSet"

export function lunasa({
	accountFieldSet,
	root,
	sessionToken
}: {
	accountFieldSet: FieldSet,
	root: HTMLElement,
	sessionToken: string
}) {
	const accounts = new Accounts({
		accountFieldSet,
		restClient: RestApi(sessionToken),
	})
	ReactDOM.render(
		<Provider inject={[accounts]}>
			<App />
		</Provider>,
		root
	)
}

window.lunasa = lunasa
