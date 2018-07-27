/* @flow strict */

import Card from "@salesforce/design-system-react/components/card"
import Icon from "@salesforce/design-system-react/components/icon"
import $ from "jquery"
import moment from "moment"
import * as React from "react"
import ReactHtmlParser from "react-html-parser"
import { type FieldSet, type FieldType } from "../models/FieldSet"
import { type Record } from "../models/QueryResult"
import "./AccountCard.css"
import Draggable from "./Draggable"

type Props = {
	fieldSet: FieldSet,
	record: Record
}

const imagePattern = /^\s*<img .*>\s*$/i

function format(type: FieldType, value: any): React.Node {
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
		case "string":
			if (typeof value === "string" && value.match(imagePattern)) {
				return ReactHtmlParser(value)
			} else {
				return String(value)
			}
		default:
			return String(value)
	}
}

export default function AccountCard({ fieldSet, record }: Props) {
	const fields: React.Node[] = []
	var accountName: ?string
	for (const { name, label, type } of fieldSet) {
		if (name === "Name") {
			accountName = record[name]
		} else {
			const displayValue = format(type, record[name])
			fields.push(
				<dt
					className="slds-item_label slds-text-color-weak slds-truncate"
					key={name}
					title={label}
				>
					{label}
				</dt>
			)
			fields.push(
				<dd
					className="slds-item_detail slds-truncate"
					key={name + "-value"}
					title={displayValue}
				>
					{displayValue}
				</dd>
			)
		}
	}
	return (
		<Draggable
			identifier={{
				type: "Account",
				url: record.attributes.url
			}}
			options={{
				helper: "clone", // clone card when dragging, leave original in list
				opacity: 0.35,
				start(event, ui) {
					// Fixes width of the dragged element so that it matches the
					// width of the original account card. Without this callback
					// the dragged version of the account card appears to be too
					// wide.
					ui.helper.width($(event.target).width())
				},
				zIndex: 100
			}}
		>
			<Card
				className="slds-card__tile"
				bodyClassName="account-card"
				heading={accountName || "Account"}
				icon={<Icon category="standard" name="account" size="small" />}
			>
				<article className="slds-tile">
					<div className="slds-tile__detail">
						<dl className="slds-list_horizontal slds-wrap">{fields}</dl>
					</div>
				</article>
			</Card>
		</Draggable>
	)
}
