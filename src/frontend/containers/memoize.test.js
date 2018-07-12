/* @flow strict */

import { delay } from "../testHelpers"
import { memoize, preserveRequestOrder, skipDuplicateInputs } from "./memoize"

type Id = number
type Account = { id: number }

it("memoizes a function", async () => {
	let callCount = 0
	async function fetchAccount(id: Id): Promise<Account> {
		callCount += 1
		return { id }
	}
	const fn = memoize(fetchAccount)
	expect(await fn(1)).toEqual({ id: 1 })
	expect(await fn(1)).toEqual({ id: 1 })
	expect(await fn(2)).toEqual({ id: 2 })
	expect(await fn(2)).toEqual({ id: 2 })
	expect(callCount).toBe(2)
})

it("returns the latest result when invoking an async function repeatedly", async () => {
	async function fetchAccount(
		id: Id,
		opts: { delay: number }
	): Promise<Account> {
		await delay(opts.delay)
		return { id }
	}
	const fn = preserveRequestOrder(fetchAccount)
	const resp1 = fn(1, { delay: 10 })
	const resp2 = fn(2, { delay: 5 })
	const resp3 = fn(3, { delay: 2 })
	expect(await resp1).toEqual({ id: 3 })
	expect(await resp2).toEqual({ id: 3 })
	expect(await resp3).toEqual({ id: 3 })
})

it("returns a cached result on consecutive invocations with the same inputs", async () => {
	let callCount = 0
	async function fetchAccount(id: Id): Promise<Account> {
		callCount += 1
		return { id }
	}
	const fn = skipDuplicateInputs(fetchAccount)
	expect(await fn(1)).toEqual({ id: 1 })
	expect(await fn(1)).toEqual({ id: 1 })
	expect(await fn(2)).toEqual({ id: 2 })
	expect(await fn(1)).toEqual({ id: 1 })
	expect(await fn(2)).toEqual({ id: 2 })
	expect(await fn(2)).toEqual({ id: 2 })
	expect(callCount).toBe(4)
})
