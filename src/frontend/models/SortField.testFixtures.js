/* @flow strict */

import { type SortField } from "./SortField"

export const sortFields: SortField[] = [
	// One fixture with a managed package prefix
	{
		attributes: {
			type: "oscal__Account_Scheduler_Sort_Field__mdt",
			url:
				"/services/data/v43.0/sobjects/oscal__Account_Scheduler_Sort_Field__mdt/m00f2000000kRjSAAU"
		},
		oscal__Default_Sort_Order__c: "Ascending",
		oscal__Field__c: "Account.Name",
		Label: "Account Name",
		oscal__Object__c: "Account",
		oscal__Precedence__c: 1.0,
		Id: "m00f2000000kRjSAAU"
	},
	// One fixture with no prefix
	{
		attributes: {
			type: "Account_Scheduler_Sort_Field__mdt",
			url:
				"/services/data/v43.0/sobjects/Account_Scheduler_Sort_Field__mdt/m00f2000000kRjSAAX"
		},
		Default_Sort_Order__c: "Descending",
		Field__c: "Account.CreatedDate",
		Label: "Account Created Date",
		Object__c: "Account",
		Precedence__c: 2.0,
		Id: "m00f2000000kRjSAAX"
	}
]
