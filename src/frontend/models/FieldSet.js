/* @flow strict */

// This list might not be exhaustive
export type FieldType =
	| "address" // given as `Address` object
	| "boolean" // given as JSON boolean
	| "currency"
	| "date" // given as string
	| "datetime" // given as string
	| "double"
	| "id" // given as string
	| "int"
	| "phone" // given as string
	| "picklist"
	| "reference" // same as "id"
	| "string" // given as string
	| "textarea" // given as string
	| "url" // given as string

export type FieldSet = Array<{
	name: string,
	label: string,
	type: FieldType
}>

// References for certain field types:

export type Address = {
	city: string,
	country: string,
	postalCode: string,
	state: string,
	street: string
}

/*
 * Produce the fieldList portion of a SOQL query
 */
export function fieldList(fieldSet: FieldSet): string {
	return fieldSet.map(fs => fs.name).join(", ")
}
