/*
 * RemoteObject is a promisified wrapper around a Visualforce remote object API.
 * An instance of RemoteObject is intended to be used as a singleton. Records
 * are represented as plain Javascript values.
 *
 * @flow strict
 */

import { type SObjectDescription } from "../models/SObjectDescription"
import { serializeObject } from "../models/serialization"
import { type Callback, type Criteria, type SObject } from "./SObject"

type Id = string

export default class RemoteObject<Fields: Object> {
	sObject: Promise<SObject<Fields>>

	constructor(sObject: SObject<Fields> | Promise<SObject<Fields>>) {
		this.sObject = Promise.resolve(sObject)
	}

	async create(values: $Shape<Fields>): Promise<Id> {
		const sObject = await this.sObject
		// Salesforce modifies the given object to add stuff like an `Id` field.
		const record: Fields = serializeObject(values)
		await lift(cb => sObject.create(record, cb))
		return record.Id
	}

	async describe(): Promise<SObjectDescription> {
		const sObject = await this.sObject
		return lift(cb => sObject.describe(cb))
	}

	async retrieve(criteria: Criteria<Fields>): Promise<Fields[]> {
		const sObject = await this.sObject
		const results = await lift(cb =>
			sObject.retrieve(serializeObject(criteria), cb)
		)
		return results.map(r => r._props)
	}

	async update(ids: Id[], changes: $Shape<Fields>): Promise<Id[]> {
		const sObject = await this.sObject
		return lift(cb => sObject.update(ids, serializeObject(changes), cb))
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
