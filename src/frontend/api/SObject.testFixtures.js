/*
 * Mock implementation of SObject for testing and local development.
 *
 * @flow strict
 */

import { type SObjectDescription } from "../models/SObjectDescription"
import * as ef from "../models/Event.testFixtures"
import {
	type Id,
	type Callback,
	type Criteria,
	type SObject,
	type SObjectRecord,
	type RemoteEvent
} from "./SObject"

const event: RemoteEvent = ({}: any)

class SObjectRecordMock<Fields: Object> implements SObjectRecord<Fields> {
	_props: Fields
	constructor(values?: $Shape<Fields>) {
		if (values) {
			this._props = values
		}
	}
}

var lastId = 1000
function uniqueId() {
	lastId += 1
	return String(lastId)
}

export default class SObjectMock<Fields: Object> implements SObject<Fields> {
	fixtures: { [key: Id]: Fields } = {}
	create(values: $Shape<Fields>, cb: Callback<Id[]>) {
		const id = uniqueId()
		values.Id = id
		this.fixtures[id] = values
		cb(null, [id], event)
	}
	describe(cb: Callback<SObjectDescription>) {
		return cb(null, ef.eventDescription, event)
	}
	retrieve(criteria: Criteria<Fields>, cb: Callback<SObjectRecord<Fields>[]>) {
		const results = Object.keys(this.fixtures).map(
			k => new SObjectRecordMock(this.fixtures[k])
		)
		cb(null, results, event)
	}
	update(ids: Id[], changes: $Shape<Fields>, cb: Callback<Id[]>) {
		const updatedIds = []
		for (const id of ids) {
			const record = this.fixtures[id]
			if (record) {
				this.fixtures[id] = { ...record, ...changes }
				updatedIds.push(id)
			}
		}
		cb(null, updatedIds, event)
	}
}
