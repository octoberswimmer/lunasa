/* @flow strict */

import { Container } from "unstated"
import { delay } from "../testHelpers"
import {
	type AsyncActionState,
	asyncAction,
	asyncActionInitState,
	isLoading
} from "./asyncAction"

it("reports errors from asynchronous actions", async () => {
	const container = new TestContainer()
	await asyncAction(container, async () => {
		throw new Error("an error occurred")
	})
	expect(container.state.errors).toHaveLength(1)
	expect(container.state.errors[0].message).toBe("an error occurred")
})

it("indicates that a request is in progress", async () => {
	expect.assertions(2)
	const container = new TestContainer()
	// Do not await on this call to `asyncAction` so that it runs in parallel
	// with remaining test steps.
	const promise = asyncAction(container, async () => {
		await delay(5)
	})
	await delay(0)
	expect(isLoading(container)).toBe(true)
	await delay(10)
	expect(isLoading(container)).toBe(false)
	await promise // now wait until `asyncAction()` has finished
})

it("resets loading state when an error occurs", async () => {
	expect.assertions(1)
	const container = new TestContainer()
	await asyncAction(container, async () => {
		throw new Error("an error occurred")
	})
	expect(isLoading(container)).toBe(false)
})

type ContainerState = AsyncActionState & {
	results: string[]
}

class TestContainer extends Container<ContainerState> {
	state = {
		...asyncActionInitState,
		results: []
	}
}
