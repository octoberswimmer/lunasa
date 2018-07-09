/*
 * This is the entry point for the frontend React app. Other frontend source
 * files are under `src/frontend/`
 *
 * @flow strict
 */
import IconSettings from "@salesforce/design-system-react/components/icon-settings"
import sldsSettings from "@salesforce/design-system-react/components/settings"
import standardSprite from "@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg"
import utilitySprite from "@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg"
import spinner from "@salesforce-ux/design-system/assets/images/spinners/slds_spinner.gif"
import "@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css"
import React from "react"
import { DragDropContextProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import ReactDOM from "react-dom"
import { Provider } from "unstated"
import RestApi from "./frontend/api/RestApi"
import App from "./frontend/components/App"
import Accounts from "./frontend/containers/Accounts"
import Events from "./frontend/containers/Events"
import { type FieldSet } from "./frontend/models/FieldSet"
import { getAccountIds } from "./frontend/models/querystring"

export function lunasa({
	accountFieldSet,
	eventCreateFieldSet,
	root,
	assistiveRoot,
	sessionToken,
	staticDirectory
}: {
	accountFieldSet: FieldSet,
	eventCreateFieldSet: FieldSet,
	root: HTMLElement,
	assistiveRoot: HTMLElement,
	sessionToken: string,
	staticDirectory: string
}) {
	sldsSettings.setAppElement(assistiveRoot)
	const accounts = new Accounts({
		accountFieldSet,
		accountIds: getAccountIds(window.location),
		restClient: RestApi(sessionToken)
	})
	const events = new Events({ eventCreateFieldSet })
	ReactDOM.render(
		<Provider inject={[accounts, events]}>
			<DragDropContextProvider backend={HTML5Backend}>
				<IconSettings
					standardSprite={resolveAsset(staticDirectory, standardSprite)}
					utilitySprite={resolveAsset(staticDirectory, utilitySprite)}
				>
					<App spinner={resolveAsset(staticDirectory, spinner)} />
				</IconSettings>
			</DragDropContextProvider>
		</Provider>,
		root
	)
}
window.lunasa = lunasa

function resolveAsset(staticDirectory: string, path: string): string {
	return [staticDirectory, path].filter(s => !!s).join("/")
}

if (process.env.NODE_ENV !== "production") {
	const root = document.getElementById("root")
	const assistiveRoot = document.getElementById("mount")
	if (!root || !assistiveRoot) {
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
			assistiveRoot,
			sessionToken: "0000",
			staticDirectory: ""
		})
	})
}
