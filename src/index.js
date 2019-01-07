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
import moment from "moment-timezone"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "unstated"
import RestApi from "./frontend/api/RestApi"
import App from "./frontend/components/App"
import { LabelProvider } from "./frontend/components/i18n/Label"
import Accounts from "./frontend/containers/Accounts"
import Events from "./frontend/containers/Events"
import { type FieldDefinition } from "./frontend/models/FieldDefinition"
import { type FieldSet } from "./frontend/models/FieldSet"
import { type RecordTypeInfo } from "./frontend/models/RecordType"
import { type SortField } from "./frontend/models/SortField"

export function lunasa({
	accountFieldSet,
	accountIds,
	eventCreateFieldSet,
	eventRecordTypeInfos,
	labels,
	language,
	timezone = moment.tz.guess(),
	root,
	assistiveRoot,
	sessionToken,
	sortFields,
	fieldDefinitions,
	staticDirectory,
	userId
}: {
	accountFieldSet: FieldSet,
	accountIds?: ?(string[]),
	eventCreateFieldSet: FieldSet,
	eventRecordTypeInfos: RecordTypeInfo[],
	labels: { [key: string]: string },
	language?: string,
	timezone?: string,
	root: HTMLElement,
	assistiveRoot: HTMLElement,
	sessionToken: string,
	sortFields: SortField[],
	fieldDefinitions: FieldDefinition[],
	staticDirectory: string,
	userId: string
}) {
	// Set base path for requests for lazily-loaded Javascript chunks.
	declare var __webpack_public_path__: string
	if (staticDirectory) {
		__webpack_public_path__ = staticDirectory + "/"
	}

	sldsSettings.setAppElement(assistiveRoot)
	const restClient = RestApi(sessionToken)
	const accounts = new Accounts({
		accountFieldSet,
		accountIds,
		locale: language,
		restClient,
		sortFields,
		fieldDefinitions
	})
	const events = new Events({
		eventCreateFieldSet,
		eventRecordTypeInfos,
		restClient,
		timezone,
		userId
	})
	ReactDOM.render(
		<Provider inject={[accounts, events]}>
			<IconSettings
				standardSprite={resolveAsset(staticDirectory, standardSprite)}
				utilitySprite={resolveAsset(staticDirectory, utilitySprite)}
			>
				<LabelProvider value={labels}>
					<App
						labels={labels}
						language={language}
						spinner={resolveAsset(staticDirectory, spinner)}
					/>
				</LabelProvider>
			</IconSettings>
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
		import("./frontend/models/CustomLabel.testFixtures"),
		import("./frontend/models/Event.testFixtures"),
		import("./frontend/models/FieldDefinition.testFixtures"),
		import("./frontend/models/SortField.testFixtures")
	]).then(
		([
			accountFixtures,
			labelFixtures,
			eventFixtures,
			fieldDefinitionFixtures,
			sortFieldFixtures
		]) => {
			lunasa({
				accountFieldSet: accountFixtures.accountFieldSet,
				eventCreateFieldSet: eventFixtures.eventCreateFieldSet,
				eventRecordTypeInfos: eventFixtures.eventRecordTypeInfos,
				labels: labelFixtures.labels,
				language: navigator.language,
				root,
				assistiveRoot,
				sessionToken: "0000",
				sortFields: sortFieldFixtures.sortFields,
				fieldDefinitions: fieldDefinitionFixtures.fieldDefinitions,
				staticDirectory: "",
				userId: "testuserid"
			})
		}
	)
}
