/* @flow strict */

import * as React from "react"
import "./AccountCard.css"

type Props = {
	columns: Array<{ fieldNameOrPath: string, value: string | null }>
}

export default function AccountCard(props: Props) {
	const fields: React.Node[] = []
	for (const { fieldNameOrPath, value } of props.columns) {
		if (value) {
			fields.push(<dt key={fieldNameOrPath}>{fieldNameOrPath}</dt>)
			fields.push(<dd key={fieldNameOrPath+'-value'}>{value}</dd>)
		}
	}
	return <dl className="account-card">{fields}</dl>
}
