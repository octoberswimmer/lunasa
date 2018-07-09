/* @flow strict */

import isArrayish from "is-arrayish"
import querystring from "querystring"

/*
 * `getAccountIds` returns selected IDs given the value of `window.location`.
 * Parameters are provided in the form, "?accountId=someId&accountId=anotherId".
 */
export function getAccountIds(location: Location): ?(string[]) {
	const search = location.search.replace(/^\?/, "")
	const ids = querystring.parse(search).accountId
	if (ids && !isArrayish(ids)) {
		return [ids]
	} else {
		return ids
	}
}
