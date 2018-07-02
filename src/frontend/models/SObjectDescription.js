/* @flow strict */

import { type FieldType } from "./FieldSet"

type URL = string

export type PickListValue = {|
	active: boolean,
	defaultValue: boolean,
	label: string,
	value: string
|}

export type Field = {|
	autonumber: boolean,
	byteLength: number,
	calculated: boolean,
	caseSensitive: boolean,
	createable: boolean,
	custom: boolean,
	defaultedOnCreate: boolean,
	dependentPicklist: boolean,
	deprecatedAndHidden: boolean,
	digits: number,
	displayLocationInDecimal: boolean,
	filterable: boolean,
	groupable: boolean,
	htmlFormatted: boolean,
	idLookup: boolean,
	label: string,
	length: number,
	name: string,
	nameField: boolean,
	namePointing: boolean,
	nillable: boolean,
	permissionable: boolean,
	picklistValues?: PickListValue[],
	precision: number,
	relationshipName?: string,
	referenceTo: string[],
	restrictedPicklist: boolean,
	scale: number,
	sortable: boolean,
	type: FieldType,
	unique: boolean,
	updateable: boolean,
	writeRequiresMasterRead: boolean
|}

export type SObjectDescription = {|
	activateable: boolean,
	childRelationships: Array<{
		cascadeDelete: boolean,
		childSObject: string,
		deprecatedAndHidden: boolean,
		field: string,
		relationshipName?: string
	}>,
	creatable: boolean,
	custom: boolean,
	customSetting: boolean,
	deleteable: boolean,
	deprecatedAndHidden: boolean,
	feedEnabled: boolean,
	fields: Field[],
	keyPrefix: string,
	label: string,
	labelPlural: string,
	layoutable: boolean,
	mergeable: boolean,
	name: string,
	queryable: boolean,
	replicateable: boolean,
	retrieveable: boolean,
	searchable: boolean,
	searchLayoutable: boolean,
	triggerable: boolean,
	undeletable: boolean,
	updateable: boolean,
	urlDetail: URL,
	urlEdit: URL,
	urlNew: URL
|}
