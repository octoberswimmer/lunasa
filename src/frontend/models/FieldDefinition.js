/*
 * Client-side representation of FieldDefinition objects.
 *
 * In same cases the `Field__c` field of a `SortField` record comes in the form
 * of a durable ID. A `FieldDefinition` record maps durable IDs to qualified API
 * names, which can be used in the `order by` clause in SOQL queries.
 *
 * @flow strict
 */

export type FieldDefinition = {
	DurableId: string,
	QualifiedApiName: string,
	ValueTypeId: string
}
