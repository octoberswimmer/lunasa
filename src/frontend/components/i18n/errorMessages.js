/* @flow strict */

import * as React from "react"
import { Label } from "./Label"

export const FIELD_REQUIRED = "Required"
export const INVALID_DATE = "Invalid date"
export const INVALID_TIME = "Invalid time"

export function getErrorText(errorMessage: ?string): ?React.Node {
	if (!errorMessage) {
		return
	}
	switch (errorMessage) {
		case FIELD_REQUIRED:
			return <Label>Field_Required</Label>
		case INVALID_DATE:
			return <Label>Invalid_Date</Label>
		case INVALID_TIME:
			return <Label>Invalid_Time</Label>
		default:
			return errorMessage
	}
}
