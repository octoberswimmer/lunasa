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
	fixtures: { [key: Id]: Fields }

	constructor({ fixtures = {} }: { fixtures?: { [key: Id]: Fields } } = {}) {
		this.fixtures = { ...fixtures } // Make a defensive copy.
		if (typeof beforeEach !== "undefined") {
			// Reset fake server state before each test.
			beforeEach(() => {
				this.fixtures = { ...fixtures }
			})
		}
	}

	create(values: $Shape<Fields>, cb: Callback<Id[]>) {
		const id = uniqueId()
		values.Id = id
		this.fixtures[id] = values
		cb(null, [id], event)
	}
	del(ids: Id[], cb: Callback<Id[]>) {
		const deletedIds = []
		for (const id of ids) {
			if (this.fixtures.hasOwnProperty(id)) {
				delete this.fixtures[id]
				deletedIds.push(id)
			}
		}
		cb(null, deletedIds, event)
	}
	describe(cb: Callback<SObjectDescription>) {
		return cb(null, ef.eventDescription, event)
	}
	retrieve(criteria: Criteria<Fields>, cb: Callback<SObjectRecord<Fields>[]>) {
		const keys = Object.keys(this.fixtures)
		const results = keys
			.map(k => new SObjectRecordMock(this.fixtures[k]))
			.slice(criteria.offset || 0) //so it is possible to mock offset
			.slice(0, criteria.limit || keys.length) //so it is possible to mock limit
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
