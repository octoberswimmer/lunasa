/* @flow strict */

import { type ListView, type ListViews, type Results } from "./ListView"

export const accountListViews: ListViews = {
	done: true,
	listviews: [
		{
			describeUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l1oEAA/describe",
			developerName: "NewThisWeek",
			id: "00Bf20000080l1oEAA",
			label: "New This Week",
			resultsUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l1oEAA/results",
			soqlCompatible: true,
			url: "/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l1oEAA"
		},
		{
			describeUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l1zEAA/describe",
			developerName: "NewLastWeek",
			id: "00Bf20000080l1zEAA",
			label: "New Last Week",
			resultsUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l1zEAA/results",
			soqlCompatible: true,
			url: "/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l1zEAA"
		},
		{
			describeUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2GEAQ/describe",
			developerName: "PlatinumandGoldSLACustomers",
			id: "00Bf20000080l2GEAQ",
			label: "Platinum and Gold SLA Customers",
			resultsUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2GEAQ/results",
			soqlCompatible: true,
			url: "/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2GEAQ"
		},
		{
			describeUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2OEAQ/describe",
			developerName: "RecentlyViewedAccounts",
			id: "00Bf20000080l2OEAQ",
			label: "Recently Viewed Accounts",
			resultsUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2OEAQ/results",
			soqlCompatible: true,
			url: "/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2OEAQ"
		},
		{
			describeUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2PEAQ/describe",
			developerName: "AllAccounts",
			id: "00Bf20000080l2PEAQ",
			label: "All Accounts",
			resultsUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2PEAQ/results",
			soqlCompatible: true,
			url: "/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2PEAQ"
		},
		{
			describeUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2ZEAQ/describe",
			developerName: "MyAccounts",
			id: "00Bf20000080l2ZEAQ",
			label: "My Accounts",
			resultsUrl:
				"/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2ZEAQ/results",
			soqlCompatible: true,
			url: "/services/data/v43.0/sobjects/Account/listviews/00Bf20000080l2ZEAQ"
		}
	],
	nextRecordsUrl: null,
	size: 6,
	sobjectType: "Account"
}

export const accountResults: Results = {
	columns: [
		{
			ascendingLabel: "Z-A",
			descendingLabel: "A-Z",
			fieldNameOrPath: "Name",
			hidden: false,
			label: "Account Name",
			selectListItem: "Name",
			sortDirection: "ascending",
			sortIndex: 0,
			sortable: true,
			type: "string"
		},
		{
			ascendingLabel: "Z-A",
			descendingLabel: "A-Z",
			fieldNameOrPath: "Site",
			hidden: false,
			label: "Account Site",
			selectListItem: "Site",
			sortDirection: null,
			sortIndex: null,
			sortable: true,
			type: "string"
		},
		{
			ascendingLabel: "Z-A",
			descendingLabel: "A-Z",
			fieldNameOrPath: "BillingState",
			hidden: false,
			label: "Billing State/Province",
			selectListItem: "BillingState",
			sortDirection: null,
			sortIndex: null,
			sortable: true,
			type: "string"
		},
		{
			ascendingLabel: "9-0",
			descendingLabel: "0-9",
			fieldNameOrPath: "Phone",
			hidden: false,
			label: "Phone",
			selectListItem: "Phone",
			sortDirection: null,
			sortIndex: null,
			sortable: true,
			type: "phone"
		},
		{
			ascendingLabel: "Low to High",
			descendingLabel: "High to Low",
			fieldNameOrPath: "Type",
			hidden: false,
			label: "Type",
			selectListItem: "toLabel(Type)",
			sortDirection: null,
			sortIndex: null,
			sortable: true,
			type: "picklist"
		},
		{
			ascendingLabel: "Z-A",
			descendingLabel: "A-Z",
			fieldNameOrPath: "Owner.Alias",
			hidden: false,
			label: "Account Owner Alias",
			selectListItem: "Owner.Alias",
			sortDirection: null,
			sortIndex: null,
			sortable: true,
			type: "string"
		},
		{
			ascendingLabel: null,
			descendingLabel: null,
			fieldNameOrPath: "Id",
			hidden: true,
			label: "Account ID",
			selectListItem: "Id",
			sortDirection: null,
			sortIndex: null,
			sortable: false,
			type: "id"
		},
		{
			ascendingLabel: null,
			descendingLabel: null,
			fieldNameOrPath: "CreatedDate",
			hidden: true,
			label: "Created Date",
			selectListItem: "CreatedDate",
			sortDirection: null,
			sortIndex: null,
			sortable: false,
			type: "datetime"
		},
		{
			ascendingLabel: null,
			descendingLabel: null,
			fieldNameOrPath: "LastModifiedDate",
			hidden: true,
			label: "Last Modified Date",
			selectListItem: "LastModifiedDate",
			sortDirection: null,
			sortIndex: null,
			sortable: false,
			type: "datetime"
		},
		{
			ascendingLabel: null,
			descendingLabel: null,
			fieldNameOrPath: "SystemModstamp",
			hidden: true,
			label: "System Modstamp",
			selectListItem: "SystemModstamp",
			sortDirection: null,
			sortIndex: null,
			sortable: false,
			type: "datetime"
		},
		{
			ascendingLabel: null,
			descendingLabel: null,
			fieldNameOrPath: "Owner.Id",
			hidden: true,
			label: "User ID",
			selectListItem: "Owner.Id",
			sortDirection: null,
			sortIndex: null,
			sortable: false,
			type: "id"
		},
		{
			ascendingLabel: null,
			descendingLabel: null,
			fieldNameOrPath: "OwnerId",
			hidden: true,
			label: "Owner ID",
			selectListItem: "OwnerId",
			sortDirection: null,
			sortIndex: null,
			sortable: false,
			type: "reference"
		}
	],
	developerName: "NewThisWeek",
	done: true,
	id: "00Bf20000080l1o",
	label: "New This Week",
	records: [
		{
			columns: [
				{ fieldNameOrPath: "Name", value: "FastCo" },
				{ fieldNameOrPath: "Site", value: null },
				{ fieldNameOrPath: "BillingState", value: null },
				{ fieldNameOrPath: "Phone", value: null },
				{ fieldNameOrPath: "Type", value: null },
				{ fieldNameOrPath: "Owner.Alias", value: "jhall" },
				{ fieldNameOrPath: "Id", value: "001f200001XWbF9AAL" },
				{
					fieldNameOrPath: "CreatedDate",
					value: "Thu Jun 21 17:39:11 GMT 2018"
				},
				{
					fieldNameOrPath: "LastModifiedDate",
					value: "Thu Jun 21 17:39:11 GMT 2018"
				},
				{
					fieldNameOrPath: "SystemModstamp",
					value: "Thu Jun 21 17:39:11 GMT 2018"
				},
				{ fieldNameOrPath: "Owner.Id", value: "005f2000008PTeXAAW" },
				{ fieldNameOrPath: "OwnerId", value: "005f2000008PTeXAAW" }
			]
		}
	],
	size: 1
}
