/* @flow strict */

import equal from "fast-deep-equal"

type CacheEntry<Inputs, R> = { inputs: Inputs, result: R , timestamp: number}

/*
 * `memoize` stores the result for a given set of inputs in a cache, and returns
 * the cached result on subsequent invocations with the same inputs.
 */
export function memoize<Inputs: *, R>(
	fn: (...inputs: Inputs) => R
): (...inputs: Inputs) => R {
	const cache: CacheEntry<Inputs, R>[] = [];
	const CACHE_EXPIRATION = 5000; // set the cache expiration time to 5 seconds
  
	return function _memoize(...inputs: Inputs): R {
	  const now = Date.now(); // get the current time
	  const entry = cache.find(
		(entry) => equal(entry.inputs, inputs) && now - entry.timestamp < CACHE_EXPIRATION
	  ); // check if the cached entry exists and has not expired
  
	  if (entry) {
		return entry.result;
	  }
  
	  const result = fn(...inputs);
	  cache.push({ inputs, result, timestamp: now }); // add the timestamp when adding the entry to the cache
	  return result;
	};
}

/*
 * `preserveRequestOrder` produces a function that returns a function that
 * always resolves to a value based on the last set of inputs given. For
 * example:
 *
 *     const fn = preserveRequestOrder(fetchAccountById)
 *     const promiseA = fn(1).then(account => this.setState({ account }))
 *     const promiseB = fn(2).then(account => this.setState({ account }))
 *     await Promise.all([promiseA, promiseB])
 *     expect(this.state.account.Id).toBe(2)
 *
 * In that example both promises will resolve with the account with the ID `2`.
 * `preserveRequestOrder` is to be used in cases where you do not want the
 * result of a slow-running requset to overwrite the result of a faster,
 * more-recently dispatched request.
 */
export function preserveRequestOrder<Inputs: *, R>(
	fn: (...inputs: Inputs) => Promise<R>
): (...inputs: Inputs) => Promise<R> {
	let latestResult: Promise<R>
	return async function _preserveRequestOrder(...inputs: Inputs): Promise<R> {
		const promise = fn(...inputs)
		latestResult = promise
		await promise
		return latestResult
	}
}

/*
 * `skipDuplicateInputs` stores and returns the same result on consecutive calls
 * with the same input. It computes a new result when called with a new input.
 * Unlike `memoize`, `skipDuplicateInputs` stores at most one set of inputs and
 * one result.
 */
export function skipDuplicateInputs<Inputs: *, R>(
	fn: (...inputs: Inputs) => R
): (...inputs: Inputs) => R {
	let latestInputs: Inputs
	let latestResult: R
	return function _skipDuplicates(...inputs: Inputs): R {
		if (!equal(inputs, latestInputs)) {
			latestInputs = inputs
			latestResult = fn(...inputs)
		}
		return latestResult
	}
}
