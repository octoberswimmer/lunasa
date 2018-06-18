/* @flow strict */

import { type Event } from "../models/Event"
import { type SObject } from "./SObject"
import RemoteObject from "./RemoteObject"

export type { Event } from "../models/Event"

// Visualforce injects the Event class into the global namespace
declare var Lunasa: {
	Event: Class<SObject<Event>>
}

const EventModel: Promise<SObject<Event>> =
	process.env.NODE_ENV !== "production"
		? import("./Events.testFixtures.js").then(module => module.default)
		: new Lunasa.Event()

export default new RemoteObject(EventModel)
