/* @flow strict */

import { type Record } from "./QueryResult"

export type Account = Record

const urlPattern = new RegExp("/sobjects/Account/([^/]+)$")

export function getId(account: Account): string {
	const match = account.attributes.url.match(urlPattern)
	if (!match) {
		throw new Error("cannot find ID for account")
	}
	return match[1]
}
