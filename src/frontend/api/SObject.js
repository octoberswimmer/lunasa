/*
 * This module describes the Visualforce remote object API. There are no
 * implementations here - only Flow types that match the Visualforce APIs.
 *
 * @flow strict
 */

import { type SObjectDescription } from "../models/SObjectDescription"

// Type alias to make function signatures more descriptive
export type Id = string

/*
 * Type of events sent from VisualForce remote actions
 */
export interface RemoteEvent {
	action: string; // controller class
	message?: string; // possible error message
	method: string; // method name
	status: boolean;
	statusCode: number;
	type: "rpc" | "exception"; // 'rpc' on success, 'exception' on error
	where?: string; // stack trace
}

export type Callback<T> = (
	error: ?Error,
	result: ?T,
	event: RemoteEvent
) => void

export type Criteria<Fields: Object = Object> = {|
	limit?: number,
	orderBy?: Ordering<Fields>[],
	where?: Conditions<Fields>
|}

type Conditions<Fields: Object = Object> = {
	[key: $Keys<Fields>]: Conditions<Fields>,
	eq?: any,
	ne?: any,
	lt?: any,
	lte?: any,
	gt?: any,
	gte?: any,
	like?: string,
	in?: any[],
	nin?: any[],
	and?: Conditions<Fields>,
	or?: Conditions<Fields>
}

type Ordering<Fields: Object = Object> = {
	[key: $Keys<Fields>]: "ASC" | "DESC"
}

/*
 * The interfaces `SObject` and `SObjectRecord` describe a subset of the
 * Visualforce Remote Object API. Visualforce actually implements both
 * interfaces in the same class. But to keep concerns cleanly seperated we
 * prentend that we have one type for making requests (`SObject`), and
 * a separate type to hold data (`SObjectRecord`).
 */
export interface SObject<Fields: Object> {
	constructor(): any;
	create(values: $Shape<Fields>, cb: Callback<Id[]>): void;
	del(ids: Id[], cb: Callback<Id[]>): void;
	describe(cb: Callback<SObjectDescription>): void;
	retrieve(
		criteria: Criteria<Fields>,
		cb: Callback<SObjectRecord<Fields>[]>
	): void;
	update(ids: Id[], changes: $Shape<Fields>, cb: Callback<Id[]>): void;
}

export interface SObjectRecord<Fields: Object> {
	_props: Fields;
	constructor(values: $Shape<Fields>): any;
}
