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
	transformAfterRetrieve: ?(record: Fields) => Fields

	constructor(
		sObject: SObject<Fields> | Promise<SObject<Fields>>,
		options?: {| transformAfterRetrieve?: (record: Fields) => Fields |}
	) {
		this.sObject = Promise.resolve(sObject)
		this.transformAfterRetrieve = options && options.transformAfterRetrieve
	}

	async create(values: $Shape<Fields>): Promise<Id> {
		const sObject = await this.sObject
		// Salesforce modifies the given object to add stuff like an `Id` field.
		const record: Fields = serializeObject(values)
		const createdIds = await lift(cb => sObject.create(record, cb))
		const id = createdIds[0]
		if (!id || createdIds.length !== 1) {
			throw new Error("An error occurred creating the new record.")
		}
		return id
	}

	// `del` is short for `delete`
	async del(ids: Id[]): Promise<Id[]> {
		const sObject = await this.sObject
		return lift(cb => sObject.del(ids, cb))
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
		const records = results.map(r => r._props)
		return this.transformAfterRetrieve
			? records.map(this.transformAfterRetrieve)
			: records
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
