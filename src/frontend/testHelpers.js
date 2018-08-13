/* @flow strict */

import { type ReactWrapper, type ShallowWrapper } from "enzyme"
import moment from "moment"
import resetDateCache from "reset-date-cache"

/*
 * Returns a promise that resolves after the given timeout.
 */
export function delay(ms: number = 0): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export function failIfMissing<T>(x: T): $NonMaybeType<T> {
	if (x === null || typeof x === "undefined") {
		throw new Error("a required value is missing")
	}
	return x
}

/*
 * Get an input HTML element from a React wrapper with the proper type.
 */
export function inputElement(wrapper: ReactWrapper): HTMLInputElement {
	return (wrapper: any).getDOMNode()
}

/*
 * `moment` values created in the callback will have the given locale
 */
export async function withLocaleAndTz<T>(
	locale: string,
	tz: string,
	cb: () => Promise<T>
): Promise<T> {
	const origLocale = moment.locale()
	moment.locale(locale)
	const result = await withTimezone(tz, cb)
	moment.locale(origLocale)
	return result
}

/*
 * Sets the given time zone within the callback
 */
export async function withTimezone<T>(
	tz: string,
	cb: () => Promise<T>
): Promise<T> {
	const origTz = process.env.TZ
	process.env.TZ = tz
	resetDateCache()
	const result = await cb()
	process.env.TZ = origTz
	resetDateCache()
	return result
}
