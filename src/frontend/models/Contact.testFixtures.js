/* @flow strict */
import { type QueryResult } from "./QueryResult"
import { type Contact } from "./Contact"
import { type FieldSet } from "./FieldSet"

export const contactFieldSet: FieldSet = [
	{ name: "Name", label: "Name", type: "string" }
]

export const contacts: Contact[] = [
	{
		attributes: {
			type: "Contact",
			url: "/services/data/v50.0/sobjects/Contact/003f200001XrDt5AAF"
		},
		Id: "003f200001XrDt5AAF",
		Name: "Contact 1"
	}
]

export const contactQueryResult: QueryResult = {
	totalSize: 3,
	done: true,
	records: [
		{
			attributes: {
				type: "Contact",
				url: "/services/data/v40.0/sobjects/Contact/003f200001XrDt5AAF"
			},
			Name: "Contact 1"
		},
		{
			attributes: {
				type: "Contact",
				url: "/services/data/v40.0/sobjects/Contact/003f200001XrDt3AAF"
			},
			Name: "Contact 2"
		},
		{
			attributes: {
				type: "Contact",
				url: "/services/data/v40.0/sobjects/Account/003f200001XrDt4AAF"
			},
			Name: "Contact 3"
		}
	]
}
