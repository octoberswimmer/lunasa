/*
 * Client-side representation of Account_Scheduler_Sort_Field__mdt objects.
 *
 * @flow strict
 */

import { type FieldDefinition } from "./FieldDefinition"

type URL = string

export type SortDirection = "Ascending" | "Descending"

type SortFieldNoPrefix = {
	attributes: {
		type: string, // e.g. "Account"
		url: URL
	},
	Default_Sort_Order__c: SortDirection,
	Field__c: string,
	Id: string,
	Label: string,
	Object__c: string,
	Precedence__c: number
}

// Sort Field property names may come with a managed-package prefix. This type
// shows one possible example of such a prefix to help catch cases where we
// forget to account for a prefix.
type SortFieldWithPrefix = {
	attributes: {
		type: string, // e.g. "Account"
		url: URL
	},
	oscal__Default_Sort_Order__c: SortDirection,
	oscal__Field__c: string,
	Id: string,
	Label: string,
	oscal__Object__c: string,
	oscal__Precedence__c: number
}

export type SortField = SortFieldNoPrefix | SortFieldWithPrefix

export const ASCENDING: SortDirection = "Ascending"
export const DESCENDING: SortDirection = "Descending"

export const getDefaultSortOrder = getProperty.bind(
	null,
	"Default_Sort_Order__c"
)
const getField = getProperty.bind(null, "Field__c")
export const getObject = getProperty.bind(null, "Object__c")
export const getPrecedence = getProperty.bind(null, "Precedence__c")

function getProperty<K: $Keys<SortFieldNoPrefix>>(
	propName: K,
	s: SortField
): $ElementType<SortFieldNoPrefix, K> {
	const key = Object.keys(s).find(k => k.endsWith(propName))
	if (!key) {
		// Type-checking should prevent this error condition.
		throw new Error(
			`Sort field does not contain a property name matching ${propName}`
		)
	}
	return (s: any)[key]
}

// Get the field name to use in the `order by` clause of a SOQL query. This
// might require mapping a durable ID to a qualified API name.
export function getFieldForSoql(s: SortField, fs: FieldDefinition[]): string {
	const field = getField(s)
	const matchingFd = fs.find(fd => fd.DurableId === field)
	if (matchingFd) {
		return matchingFd.QualifiedApiName
	} else {
		return field
	}
}
