/* @flow strict */

import { type SortField } from "./SortField"

export const sortFields: SortField[] = [
	{
		attributes: {
			type: "Account_Scheduler_Sort_Field__mdt",
			url:
				"/services/data/v43.0/sobjects/Account_Scheduler_Sort_Field__mdt/m00f2000000kRjSAAU"
		},
		Default_Sort_Order__c: "Ascending",
		Field__c: "Account.Name",
		Label: "Account Name",
		Object__c: "Account",
		Precedence__c: 1.0,
		Id: "m00f2000000kRjSAAU"
	},
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
