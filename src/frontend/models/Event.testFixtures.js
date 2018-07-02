/* @flow strict */

import moment from "moment"
import { type Event } from "./Event"
import { type FieldSet } from "./FieldSet"

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

export const eventCreateFieldSet: FieldSet = [
	{
		name: "Subject",
		label: "Subject",
		type: "combobox"
	},
	{
		name: "StartDateTime",
		label: "Start Date Time",
		type: "datetime"
	},
	{
		name: "EndDateTime",
		label: "End Date Time",
		type: "datetime"
	},
	{
		name: "IsAllDayEvent",
		label: "All-Day Event",
		type: "boolean"
	},
	{
		name: "AccountId",
		label: "Account ID",
		type: "reference"
	},
	{
		name: "Description",
		label: "Description",
		type: "textarea"
	},
	{
		name: "EventSubtype",
		label: "Event Subtype",
		type: "picklist"
	}
]
