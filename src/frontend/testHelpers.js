/* @flow strict */

import { type ReactWrapper, type ShallowWrapper } from "enzyme"
import moment from "moment"

/*
 * Returns a promise that resolves after the given timeout.
 */
export function delay(ms: number = 0): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export function failIfMissing<T>(x: T): $NonMaybeType<T> {
	if (x === null || typeof x === "undefined") {
		throw new Error("a fixture is missing")
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
export async function withLocale<T>(
	locale: string,
	cb: () => Promise<T>
): Promise<T> {
	const origLocale = moment.locale()
	moment.locale(locale)
	const result = await cb()
	moment.locale(origLocale)
	return result
}
