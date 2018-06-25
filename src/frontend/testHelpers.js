/* @flow strict */

import { type ReactWrapper, type ShallowWrapper } from "enzyme"

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
