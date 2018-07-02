/*
 * This is a wrapper around the DateTime component from react-datetime that
 * allows it to be used transparently in a form managed by formik. Provide
 * a `name` prop to this component, and it will automatically connect the
 * datetime value to form state.
 *
 * @flow strict
 */

import { connect } from "formik"
import * as React from "react"
import ReactDateTime from "react-datetime"
import "react-datetime/css/react-datetime.css"

// Required prop `name`, plus a selection of react-datetime props documented at
// https://www.npmjs.com/package/react-datetime
type PublicProps = {
	name: string,
	className?: string | string[],
	dateFormat?: boolean | string,
	inputProps?: Object,
	locale?: string,
	open?: boolean,
	timeFormat?: boolean | string,
	utc?: boolean,
	viewMode?: "days" | "months" | "years" | "time"
}

type InjectedProps = {
	formik: Object // API provided by formik
}

type Props = PublicProps & InjectedProps

function DateTime({ formik, name, ...dateTimeProps }: Props) {
	return (
		<ReactDateTime
			onBlur={() => formik.setFieldTouched(name, true)}
			onChange={moment => {
				formik.setFieldValue(name, moment)
			}}
			value={formik.values[name]}
			{...dateTimeProps}
		/>
	)
}

const ConnectedDateTime: React.ComponentType<PublicProps> = connect(DateTime)
export default ConnectedDateTime
