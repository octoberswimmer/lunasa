/*
 * Mock implementation of SObject for testing and local development.
 *
 * @flow strict
 */

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

export default class SObjectMock<Fields: Object> implements SObject<Fields> {
	fixtures: { [key: Id]: Fields } = {}
	retrieve(criteria: Criteria<Fields>, cb: Callback<SObjectRecord<Fields>[]>) {
		const results = Object.keys(this.fixtures).map(
			k => new SObjectRecordMock(this.fixtures[k])
		)
		cb(null, results, event)
	}
}
