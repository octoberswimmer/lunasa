/* @flow strict */

import moment from "moment"
import { type Event } from "./Event"

export const events: Event[] = [
	{
		Id: "1",
		EndDateTime: moment()
			.endOf("hour")
			.toDate(),
		Description: "test event",
		IsAllDayEvent: false,
		StartDateTime: moment()
			.startOf("hour")
			.toDate(),
		Subject: "Meeting"
	}
]
