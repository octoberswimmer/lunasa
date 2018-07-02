/*
 * This is the entry point for the frontend React app. Other frontend source
 * files are under `src/frontend/`
 *
 * @flow strict
 */
import React from "react"
import { DragDropContextProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
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
		restClient: RestApi(sessionToken)
	})
	ReactDOM.render(
		<Provider inject={[accounts]}>
			<DragDropContextProvider backend={HTML5Backend}>
				<App />
			</DragDropContextProvider>
		</Provider>,
		root
	)
}

window.lunasa = lunasa

if (process.env.NODE_ENV !== "production") {
	const root = document.getElementById("root")
	if (!root) {
		throw new Error("unable to locate DOM mount point for app")
	}
	import("./frontend/models/Account.testFixtures").then(af => {
		lunasa({
			accountFieldSet: af.accountFieldSet,
			root,
			sessionToken: "0000"
		})
	})
}
