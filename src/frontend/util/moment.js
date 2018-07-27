/*
 * Extra functions for working with Moment objects that have been extended by
 * Fullcalendar
 */

/*
 * `hasTime` checks a method injected by Fullcalendar to see if a Moment value
 * has a definitive time. A Moment value with no time represents a date, but but
 * not a specific time-of-day.
 */
export function hasTime(m: moment$Moment): boolean {
	// $FlowFixMe
	return typeof m.hasTime === "function" && m.hasTime()
}
