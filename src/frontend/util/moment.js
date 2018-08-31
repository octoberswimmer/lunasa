/*
 * Extra functions for working with Moment objects that have been extended by
 * Fullcalendar
 *
 * @flow strict
 */

import moment from "moment-timezone"
import * as fullcalendar from "fullcalendar"
import { type MomentInput } from "fullcalendar"

/*
 * `MomentInput` is a union of types that the `moment()` constructor can accept
 * as its first argument.
 */
export type { MomentInput } from "fullcalendar"

/*
 * `hasTime` checks a method injected by Fullcalendar to see if a Moment value
 * has a definitive time. A Moment value with no time represents a date, but but
 * not a specific time-of-day.
 */
export function hasTime(m: moment$Moment): boolean {
	// $FlowFixMe
	if (typeof m.hasTime === "function") {
		return m.hasTime()
	}
	return true
}

/*
 * In certain mode Fullcalendar uses "ambiguously-zoned" Moment values. These
 * values specify a date and time, but do not indicate which time zone applies.
 * This function determines whether a given Moment value has a specified time
 * zone.
 */
export function hasTimezone(m: moment$Moment): boolean {
	// $FlowFixMe
	if (typeof m.hasZone === "function") {
		return m.hasZone()
	}
	return true
}

/*
 * `mergeDateAndTime` takes a value representing a date, and a value
 * representing a time-of-day, and produces a new value with the given date and
 * time-of-day. For example, if `date` is 2018-08-19T00:00Z and `time` is
 * 2018-01-01T10:30Z then the result will be 2018-08-19T10:30Z.
 */
export function mergeDateAndTime({
	date,
	time
}: {
	date: moment$Moment,
	time: moment$Moment
}): moment$Moment {
	const result = moment(time)
	const d = moment(date)
	result.year(d.year())
	result.month(d.month())
	result.date(d.date())
	return result
}

/*
 * In certain mode Fullcalendar uses "ambiguously-zoned" Moment values. These
 * values specify a date and time, but do not indicate which time zone applies.
 * This function takes a Moment value that may or may not have a specified time
 * zone, and returns a new Moment value that is ambiguously-zoned.
 */
export function stripZone(m: moment$Moment): moment$Moment {
	const result = fullcalendar.moment(m).clone()
	result.stripZone()
	return result
}

/*
 * In certain mode Fullcalendar uses "ambiguously-zoned" Moment values. These
 * values specify a date and time, but do not indicate which time zone applies.
 * This function produces a new Moment value that sets the given time zone if
 * the input Moment value is ambiguously-zoned. The time and date of the input
 * Moment value are preserved with the assumption that they are appropriate for
 * the given time zone.
 */
export function disambiguateTimezone(
	timezone: string,
	m: moment$Moment
): moment$Moment {
	if (hasTimezone(m)) {
		return m.clone()
	}
	return setTimezonePreserveClockTime(timezone, m)
}

export function setTimezone(timezone: string, m: MomentInput): moment$Moment {
	return moment(m)
		.clone()
		.tz(timezone)
}

/*
 * `setTimezonePreserveClockTime` produces a new `Moment` value with the hour,
 * minute, date, etc values as the input, but in the given timezone. For
 * example, given the time 2018-08-19T10:30-07:00 and the time zone
 * Europe/Berlin, this function will return the value 2018-08-19T10:30+02:00.
 *
 * For a result set to local time (according to the browser's timezone setting)
 * set `timezone` to `null`.
 */
export function setTimezonePreserveClockTime(
	timezone: ?string,
	input: MomentInput
): moment$Moment {
	const m = moment(input)
	const result = timezone ? moment().tz(timezone) : moment()
	result.year(m.year())
	result.month(m.month())
	result.date(m.date())
	result.hour(m.hour())
	result.minute(m.minute())
	result.second(m.second())
	result.millisecond(m.millisecond())
	return result
}
