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
import Events from "./frontend/containers/Events"
import { type FieldSet } from "./frontend/models/FieldSet"

export function lunasa({
	accountFieldSet,
	eventCreateFieldSet,
	root,
	sessionToken
}: {
	accountFieldSet: FieldSet,
	eventCreateFieldSet: FieldSet,
	root: HTMLElement,
	sessionToken: string
}) {
	const accounts = new Accounts({
		accountFieldSet,
		restClient: RestApi(sessionToken)
	})
	const events = new Events({ eventCreateFieldSet })
	ReactDOM.render(
		<Provider inject={[accounts, events]}>
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
	Promise.all([
		import("./frontend/models/Account.testFixtures"),
		import("./frontend/models/Event.testFixtures")
	]).then(([accountFixtures, eventFixtures]) => {
		lunasa({
			accountFieldSet: accountFixtures.accountFieldSet,
			eventCreateFieldSet: eventFixtures.eventCreateFieldSet,
			root,
			sessionToken: "0000"
		})
	})
}
