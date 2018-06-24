/* @flow strict */

import { type ListViewDescription, type ListViews } from "./ListView"

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

export const accountListViewDescriptions: ListViewDescription[] = [
	{
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
		id: "00Bf20000080l1o",
		orderBy: [
			{
				fieldNameOrPath: "Name",
				nullsPosition: "first",
				sortDirection: "ascending"
			},
			{
				fieldNameOrPath: "Id",
				nullsPosition: "first",
				sortDirection: "ascending"
			}
		],
		query:
			"SELECT Name, Site, BillingState, Phone, toLabel(Type), Owner.Alias, Id, CreatedDate, LastModifiedDate, SystemModstamp, Owner.Id, OwnerId FROM Account WHERE CreatedDate = THIS_WEEK ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST",
		scope: "everything",
		sobjectType: "Account",
		whereCondition: {
			field: "CreatedDate",
			operator: "equals",
			values: ["THIS_WEEK"]
		}
	},
	{
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
		id: "00Bf20000080l1z",
		orderBy: [
			{
				fieldNameOrPath: "Name",
				nullsPosition: "first",
				sortDirection: "ascending"
			},
			{
				fieldNameOrPath: "Id",
				nullsPosition: "first",
				sortDirection: "ascending"
			}
		],
		query:
			"SELECT Name, Site, BillingState, Phone, toLabel(Type), Owner.Alias, Id, CreatedDate, LastModifiedDate, SystemModstamp, Owner.Id, OwnerId FROM Account WHERE CreatedDate = LAST_WEEK ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST",
		scope: "everything",
		sobjectType: "Account",
		whereCondition: {
			field: "CreatedDate",
			operator: "equals",
			values: ["LAST_WEEK"]
		}
	},
	{
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
		id: "00Bf20000080l2G",
		orderBy: [
			{
				fieldNameOrPath: "Name",
				nullsPosition: "first",
				sortDirection: "ascending"
			},
			{
				fieldNameOrPath: "Id",
				nullsPosition: "first",
				sortDirection: "ascending"
			}
		],
		query:
			"SELECT Name, Site, BillingState, Phone, Owner.Alias, Id, CreatedDate, LastModifiedDate, SystemModstamp, Owner.Id, OwnerId FROM Account ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST",
		scope: "everything",
		sobjectType: "Account",
		whereCondition: { conditions: [], conjunction: "and" }
	},
	{
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
		id: "00Bf20000080l2O",
		orderBy: [
			{
				fieldNameOrPath: "Name",
				nullsPosition: "first",
				sortDirection: "ascending"
			},
			{
				fieldNameOrPath: "Id",
				nullsPosition: "first",
				sortDirection: "ascending"
			}
		],
		query:
			"SELECT Name, Site, BillingState, Phone, toLabel(Type), Owner.Alias, Id, CreatedDate, LastModifiedDate, SystemModstamp, Owner.Id, OwnerId FROM Account USING SCOPE mru ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST",
		scope: "mru",
		sobjectType: "Account",
		whereCondition: { conditions: [], conjunction: "and" }
	},
	{
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
		id: "00Bf20000080l2P",
		orderBy: [
			{
				fieldNameOrPath: "Name",
				nullsPosition: "first",
				sortDirection: "ascending"
			},
			{
				fieldNameOrPath: "Id",
				nullsPosition: "first",
				sortDirection: "ascending"
			}
		],
		query:
			"SELECT Name, Site, BillingState, Phone, toLabel(Type), Owner.Alias, Id, CreatedDate, LastModifiedDate, SystemModstamp, Owner.Id, OwnerId FROM Account ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST",
		scope: "everything",
		sobjectType: "Account",
		whereCondition: { conditions: [], conjunction: "and" }
	},
	{
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
		id: "00Bf20000080l2Z",
		orderBy: [
			{
				fieldNameOrPath: "Name",
				nullsPosition: "first",
				sortDirection: "ascending"
			},
			{
				fieldNameOrPath: "Id",
				nullsPosition: "first",
				sortDirection: "ascending"
			}
		],
		query:
			"SELECT Name, Site, BillingState, Phone, toLabel(Type), Owner.Alias, Id, CreatedDate, LastModifiedDate, SystemModstamp, Owner.Id, OwnerId FROM Account USING SCOPE mine ORDER BY Name ASC NULLS FIRST, Id ASC NULLS FIRST",
		scope: "mine",
		sobjectType: "Account",
		whereCondition: { conditions: [], conjunction: "and" }
	}
]
