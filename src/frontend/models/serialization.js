/*
 * The Visualforce API will automatically serialize values - for example it will
 * convert `Date` instances to strings. But in some cases (such as when
 * serializing dates) it gets the wrong result.
 *
 * This module provides functions that prepare values for proper serialization.
 *
 * @flow strict
 */

import isArrayish from "is-arrayish"
import moment from "moment"

export type JsonValue =
	| { [key: string]: JsonValue }
	| JsonValue[]
	| boolean
	| null
	| number
	| string

/*
 * `serializeObject` produces a new object where values have been recursively
 * replaced with values that may appear in a JSON document.
 */
export function serializeObject<T: Object>(input: T): T {
	const output = {}
	for (const key of Object.keys(input)) {
		output[key] = serializeSingleValue(input[key])
	}
	return (output: any)
}

function serializeSingleValue(input: mixed): JsonValue {
	if (moment.isDate(input)) {
		return visualforceDatetime(moment((input: any)))
	} else if (moment.isMoment(input)) {
		return visualforceDatetime((input: any))
	} else if (isArrayish(input)) {
		return (input: any).map(serializeSingleValue)
	} else if (input && typeof input === "object") {
		return serializeObject((input: any))
	} else {
		return (input: any)
	}
}

/*
 * Visualforce requires datetime values to be in the UTC time zone in a *very*
 * *specific* format: an RFC 3339 string with whole-second precision, no
 * fractional seconds, and no time zone indicator. Use this format string with
 * moment's `.format()` method to get the appropriate string. For example:
 *
 *     moment(someDate).utc().format(RFC_3339)
 */
const RFC_3339 = "YYYY-MM-DDTHH:mm:ss"

/*
 * Creates a string representation of a date value suitable for consumption by
 * Visualforce.
 */
export function visualforceDatetime(datetime: moment$Moment) {
	const string = datetime
		.clone()
		.utc()
		.format(RFC_3339)
	// When deployed to Visualforce moment produces a formatted string with the
	// letter "A" where the letter "T" should be. The reason is unclear. This
	// does not happen in local testing.
	return string.replace("A", "T")
}
