/* @flow strict */

import { flatMap } from "../util/array"
import { type FieldSet, type FieldType } from "./FieldSet"
import * as SObject from "./SObjectDescription"

type DetailButton = Object
type RelatedList = Object

export type LayoutItemDetails = {
	aggregatable: boolean,
	aiPredictionField: boolean,
	autoNumber: boolean,
	byteLength: number,
	calculated: boolean,
	calculatedFormula: ?mixed,
	cascadeDelete: boolean,
	caseSensitive: boolean,
	compoundFieldName: ?mixed,
	controllerName: ?string,
	createable: boolean,
	custom: boolean,
	defaultValue: ?mixed,
	defaultValueFormula: ?mixed,
	defaultedOnCreate: boolean,
	dependentPicklist: boolean,
	deprecatedAndHidden: boolean,
	digits: number,
	displayLocationInDecimal: boolean,
	encrypted: boolean,
	externalId: boolean,
	extraTypeInfo: ?string,
	filterable: boolean,
	filteredLookupInfo: ?mixed,
	formulaTreatNullNumberAsZero: boolean,
	groupable: boolean,
	highScaleNumber: boolean,
	htmlFormatted: boolean,
	idLookup: boolean,
	inlineHelpText: ?string,
	label: string,
	length: number,
	mask: ?mixed,
	maskType: ?mixed,
	name: string,
	nameField: boolean,
	namePointing: boolean,
	nillable: boolean,
	permissionable: boolean,
	picklistValues: SObject.PickListValue[],
	polymorphicForeignKey: boolean,
	precision: number,
	queryByDistance: boolean,
	referenceTargetField: ?mixed,
	referenceTo: string[],
	relationshipName: ?string,
	relationshipOrder: null,
	restrictedDelete: boolean,
	restrictedPicklist: boolean,
	scale: number,
	searchPrefilterable: boolean,
	soapType: string,
	sortable: boolean,
	type: FieldType,
	unique: boolean,
	updateable: boolean,
	writeRequiresMasterRead: boolean
}

export type LayoutField = {
	details: LayoutItemDetails,
	displayLines: number,
	tabOrder: number,
	type: "Field",
	value: string // form value name, i.e. the name of the field
}

export type Separator = {
	displayLines: number,
	tabOrder: number,
	type: "Separator",
	value: string
}

export type ExpandedLookup = {
	details: LayoutItemDetails,
	displayLines: number,
	tabOrder: number,
	type: "ExpandedLookup",
	value: string
}

export type LayoutComponent = LayoutField | Separator | ExpandedLookup

export type LayoutItem = {
	editableForNew: boolean,
	editableForUpdate: boolean,
	label: string,
	layoutComponents: LayoutComponent[],
	placeholder: boolean,
	required: boolean
}

export type LayoutSection = {
	collapsed: boolean,
	columns: number,
	heading: string,
	layoutRows: Array<{
		layoutItems: LayoutItem[],
		numItems: number
	}>,
	layoutSectionId: string,
	parentLayoutId: string,
	rows: number,
	tabOrder: "TopToBottom",
	useCollapsibleSection: boolean,
	useHeading: boolean
}

export type Layout = {
	buttonLayoutSection: {
		detailButtons: DetailButton[]
	},
	detailLayoutSections: LayoutSection[],
	editLayoutSections: LayoutSection[],
	feedView: ?mixed,
	highlightsPanelLayoutSection: ?LayoutSection,
	id: string,
	multirowEditLayoutSections: LayoutSection[],
	offlineLinks: mixed[],
	quickActionList: { quickActionListItems: mixed[] },
	relatedContent: {
		relatedContentItems: Array<{ [key: string]: LayoutItem }>
	},
	relatedLists: RelatedList[],
	saveOptions: mixed[]
}

function reduceFields<R>(
	layout: Layout,
	f: (accum: R, field: LayoutItemDetails) => R,
	init: R
): R {
	const components = flatMap(
		flatMap(
			flatMap(
				flatMap(
					[layout.detailLayoutSections, layout.editLayoutSections],
					sections => sections
				),
				section => section.layoutRows
			),
			row => row.layoutItems
		),
		item => item.layoutComponents
	)
	const fieldComponents: LayoutField[] = (components.filter(
		c => c.type === "Field"
	): any)
	const fields: LayoutItemDetails[] = fieldComponents.map(c => c.details)
	return fields.reduce(f, init)
}

export function getField(layout: Layout, name: string): ?LayoutItemDetails {
	return reduceFields(
		layout,
		(accum, field) => (field.name === name ? field : accum),
		undefined
	)
}

/*
 * Picklist values reported in a layout are restricted by the values configured
 * for the Record Type associated with the layout. But it is possible that the
 * field in question is not listed in the given layout, so fall back to getting
 * an unrestricted list of picklist values from the SObject description.
 */
export function getPicklistValues(
	description: SObject.SObjectDescription,
	layout: Layout,
	name: string
): ?(SObject.PickListValue[]) {
	const field = getField(layout, name)
	return field
		? field.picklistValues
		: SObject.getPicklistValues(description, name)
}

export function getDefaultValues(
	description: SObject.SObjectDescription,
	layout: Layout,
	fieldSet: FieldSet
): Object {
	const defaultValues = {}
	for (const field of fieldSet) {
		const values = getPicklistValues(description, layout, field.name)
		const def = values && values.find(value => value.defaultValue)
		if (def) {
			defaultValues[field.name] = def.value
		}
	}
	return defaultValues
}
