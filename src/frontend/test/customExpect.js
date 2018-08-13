/*
 * Custom helpers for writing tests in Jest
 *
 * @flow strict
 */

import moment from "moment"
import { type MomentInput } from "fullcalendar"
import { type JestAsymmetricEqualityType } from "jest"

/*
 * Use `sameMoment` when matching by equality to check whether a datetime value
 * matches the given reference value within the given granularity. The value
 * being checked and the reference value may be a `Moment`, `Date`, string, or
 * number. They do not need to be the same type.
 *
 * For example:
 *
 *     expect(t).toEqual(sameMoment("2018-08-17T13:30Z"))
 *
 *     expect(event).toMatchObject({
 *         StartDateTime: sameMoment(expectedStart, "day"),
 *         EndDateTime: sameMoment(expectedEnd, "day")
 *     })
 */
export function sameMoment(
	ref: MomentInput,
	granularity?: string
): JestAsymmetricEqualityType {
	const m = moment(ref)
	return {
		asymmetricMatch(value) {
			return m.isSame(value, granularity)
		}
	}
}
