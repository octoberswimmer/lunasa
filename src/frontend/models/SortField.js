/*
 * Client-side representation of Account_Scheduler_Sort_Field__mdt objects.
 *
 * @flow strict
 */

type URL = string

export type SortDirection = "Ascending" | "Descending"

export type SortField = {
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

export const ASCENDING: SortDirection = "Ascending"
export const DESCENDING: SortDirection = "Descending"
