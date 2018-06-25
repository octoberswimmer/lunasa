/* @flow strict */

import { type Container } from "unstated"

export type AsyncActionState = {
	errors: Error[],
	loading: number
}

export const asyncActionInitState = {
	errors: [],
	loading: 0
}

/*
 * Given a callback that returns a promise, sets state to indicate loading
 * until the promise resolves, and set error state if the promise rejects.
 * Returns a promise that is guaranteed not to reject.
 */
export async function asyncAction<S: AsyncActionState, O: Container<S>, T>(
	container: O,
	cb: () => Promise<T>
): Promise<void> {
	container.setState(state => ({
		errors: [],
		loading: state.loading + 1
	}))
	try {
		await cb()
	} catch (error) {
		container.setState({ errors: [error] })
	} finally {
		container.setState(state => ({ loading: state.loading - 1 }))
	}
}

export function isLoading<S: AsyncActionState, O: Container<S>>(
	container: O
): boolean {
	return container.state.loading > 0
}
