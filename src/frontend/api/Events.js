/* @flow strict */

import { type Event } from "../models/Event"
import { type SObject } from "./SObject"
import RemoteObject from "./RemoteObject"

export type { Event } from "../models/Event"

// Visualforce injects the Event class into the global namespace
declare var Lunasa: {
	Event: Class<SObject<Event>>
}

// Load mock API module in development, production module in production. This is
// written using the `import` statement so that the development module is not
// included in the combined js file that is deployed to production. The
// production module is imported in a line at the top of the file so that it
// *is* included in the combined file - otherwise Webpack would split the
// combined js into two files.
//
// When Webpack encounters the condition `process.env.NODE_ENV === "production"`
// in non-async code it will inline the branch where that condition is true when
// building the production bundle. Webpack will remove the condition and the
// `else` branch.
const EventModel: Promise<SObject<Event>> =
	process.env.NODE_ENV !== "production"
		? import("./Events.development.js").then(module => module.default)
		: new Lunasa.Event()

export default new RemoteObject(EventModel)
