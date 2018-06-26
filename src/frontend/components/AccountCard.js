/* @flow strict */

import moment from "moment"
import * as React from "react"
import { type FieldSet, type FieldType } from "../models/FieldSet"
import { type Record } from "../models/QueryResult"
import "./AccountCard.css"

type Props = {
	fieldSet: FieldSet,
	record: Record
}

function format(type: FieldType, value: any): string {
	if (value == null) {
		return "-"
	}
	// TODO: handle "address"
	switch (type) {
		case "boolean":
			return value ? "\u2714" : "\u2718" // check or X
		case "date":
			return moment(value).format("L")
		case "datetime":
			return moment(value).calendar()
		default:
			return String(value)
	}
}

export default function AccountCard({ fieldSet, record }: Props) {
	const fields: React.Node[] = []
	for (const { name, label, type } of fieldSet) {
		const value = record[name]
		fields.push(<dt key={name}>{label}</dt>)
		fields.push(<dd key={name+'-value'}>{format(type, value)}</dd>)
	}
	return <dl className="account-card">{fields}</dl>
}
