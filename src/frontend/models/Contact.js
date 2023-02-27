/* @flow strict */

import { type Record } from "./QueryResult"

export type Contact = Record

const urlPattern = new RegExp("/sobjects/Contact/([^/]+)$")

export function getId(contact: Contact): string {
	const match = contact.attributes.url.match(urlPattern)
	if (!match) {
		throw new Error("cannot find ID for contact")
	}
	return match[1]
}
