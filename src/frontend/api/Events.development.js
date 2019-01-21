/* @flow strict */

import { type Event } from "../models/Event"
import { events } from "../models/Event.testFixtures"
import SObjectMock from "./SObject.testFixtures"

const EventModel: SObjectMock<Event> = new SObjectMock({
	fixtures: events.reduce((map, event) => {
		map[event.Id] = event
		return map
	}, {})
})
export default EventModel
