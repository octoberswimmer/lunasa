/*
 * RemoteObject is a promisified wrapper around a Visualforce remote object API.
 * An instance of RemoteObject is intended to be used as a singleton. Records
 * are represented as plain Javascript values.
 *
 * @flow strict
 */

import { type Callback, type Criteria, type SObject } from "./SObject"

export default class RemoteObject<Fields: Object> {
	sObject: Promise<SObject<Fields>>

	constructor(sObject: SObject<Fields> | Promise<SObject<Fields>>) {
		this.sObject = Promise.resolve(sObject)
	}

	async retrieve(criteria: Criteria<Fields>): Promise<Fields[]> {
		const sObject = await this.sObject
		const results = await lift(cb => sObject.retrieve(criteria, cb))
		return results.map(r => r._props)
	}
}

function lift<T>(f: (cb: Callback<T>) => void): Promise<T> {
	return new Promise((resolve, reject) => {
		f((error, results) => {
			if (error) {
				reject(error)
			} else if (results) {
				resolve(results)
			} else {
				reject(
					new Error("Remote object callback did not yield an error or a result")
				)
			}
		})
	})
}
