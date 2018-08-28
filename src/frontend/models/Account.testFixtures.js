/* @flow strict */

import { type Address, type FieldSet } from "./FieldSet"
import { type QueryResult } from "./QueryResult"

export const accountFieldSet: FieldSet = [
	{ name: "Name", label: "Account Name", type: "string" },
	{ name: "Site", label: "Account Site", type: "string" },
	{ name: "CreatedDate", label: "Created Date", type: "datetime" },
	{ name: "Phone", label: "Account Phone", type: "phone" }
]

export const accountQueryResult: QueryResult = {
	totalSize: 12,
	done: true,
	records: [
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDt5AAF"
			},
			Name: "GenePoint",
			Site: null,
			Phone: "(650) 867-3450",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDt3AAF"
			},
			Name: "United Oil & Gas, UK",
			Site: null,
			Phone: "+44 191 4956203",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDt4AAF"
			},
			Name: "United Oil & Gas, Singapore",
			Site: null,
			Phone: "(650) 450-8810",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDsvAAF"
			},
			Name: "Edge Communications",
			Site: null,
			Phone: "(512) 757-6000",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDswAAF"
			},
			Name: "Burlington Textiles Corp of America",
			Site: null,
			Phone: "(336) 222-7000",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDsxAAF"
			},
			Name: "Pyramid Construction Inc.",
			Site: null,
			Phone: "(014) 427-4427",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDsyAAF"
			},
			Name: "Dickenson plc",
			Site: null,
			Phone: "(785) 241-6200",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDszAAF"
			},
			Name: "Grand Hotels & Resorts Ltd",
			Site: null,
			Phone: "(312) 596-1000",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDt1AAF"
			},
			Name: "Express Logistics and Transport",
			Site: null,
			Phone: "(503) 421-7800",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDt2AAF"
			},
			Name: "University of Arizona",
			Site: null,
			Phone: "(520) 773-9050",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDt0AAF"
			},
			Name: "United Oil & Gas Corp.",
			Site: null,
			Phone: "(212) 842-5500",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		},
		{
			attributes: {
				type: "Account",
				url: "/services/data/v40.0/sobjects/Account/001f200001XrDt6AAF"
			},
			Name: "sForce",
			Site: null,
			Phone: "(415) 901-7000",
			CreatedDate: "2018-06-01T20:35:50.000+0000"
		}
	]
}

export const address: Address = {
	city: "Burlington",
	country: "USA",
	geocodeAccuracy: null,
	latitude: null,
	longitude: null,
	postalCode: "27215",
	state: "NC",
	street: "525 S. Lexington Ave"
}
