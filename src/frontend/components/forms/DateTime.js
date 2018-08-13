/*
 * This is a wrapper around the `Datepicker` and `Timepicker` components from
 * SLDS that allows them to be used transparently in a form managed by formik.
 * Provide a `name` and a `label` prop to this component, and it will
 * automatically connect the datetime value to form state. The managed value
 * should be an instance of `Date`.
 *
 * @flow strict
 */

import Datepicker from "@salesforce/design-system-react/components/date-picker"
import Calendar from "@salesforce/design-system-react/components/date-picker/private/calendar"
import Timepicker from "@salesforce/design-system-react/components/time-picker"
import classNames from "classnames"
import { Field } from "formik"
import moment from "moment-timezone"
import * as React from "react"
import {
	mergeDateAndTime,
	setTimezonePreserveClockTime
} from "../../util/moment"
import { Label } from "../i18n/Label"

// Patch the Datepicker calendar so that it does not steal focus from the text
// input. This change makes it possible to change the date by editing the text
// in the input. Unfortunately there does not appear to be a cleaner way to do
// this.
Calendar.prototype.getInitialState = function getInitialState() {
	return {
		focusedDate: this.props.initialDateForCalendarRender,
		calendarHasFocus: false,
		todayFocus: false
	}
}

// Patch the Timepicker to poperly set the value of its text input on
// initialization. Without this change the initial time value is not displayed,
// and React emits a warning message, "A component is changing an uncontrolled
// input of type text to be controlled."
Timepicker.prototype.getInitialState = function getInitialState() {
	return {
		value: this.props.value,
		strValue: this.props.strValue || this.props.formatter(this.props.value),
		options: this.getOptions()
	}
}

type Props = {
	containerClassName?: string | string[],
	label: string,
	name: string,
	showTime?: boolean,
	timezone: string
}

export default function DateTime({
	containerClassName,
	label,
	name,
	showTime,
	timezone
}: Props) {
	return (
		<Field
			name={name}
			render={({ field, form }) => (
				<FieldSet
					containerClassName={containerClassName}
					errorMessage={form.errors[name]}
					label={label}
				>
					<Datepicker
						labels={{ label: <Label>Date</Label> }}
						onChange={(
							event,
							{
								date
							}: { date: Date, formattedDate: string, timezoneOffset: number }
						) => {
							if (!isValidDate(date)) {
								addFieldError(form, name, "Invalid date")
							} else {
								removeFieldError(form, name, "Invalid date")
								// Datepicker assumes browser local timezone, so
								// we need to modify the value for the user's
								// timezone setting.
								const dateWithTz = setTimezonePreserveClockTime(timezone, date)
								const value = mergeDateAndTime({
									date: dateWithTz,
									// Assume value in field state is in
									// user's chosen timezone.
									time: moment.tz(field.value || dateWithTz, timezone)
								}).toDate()
								form.setFieldValue(name, value)
							}
						}}
						formatter={(date: ?Date): string =>
							date ? moment(date).format("L") : ""
						}
						parser={(inputStr: string): Date =>
							// Parse inputs according to browser local timezone;
							// we make the switch to the user's chosen timezone
							// in the `onChange` handler.
							moment(inputStr, "L", true).toDate()
						}
						triggerClassName="slds-col"
						value={
							// Datepicker assumes local timezone, so convert
							// value for display.
							setTimezonePreserveClockTime(
								null,
								moment.tz(field.value, timezone)
							).toDate()
						}
					/>
					{showTime !== false ? (
						<Timepicker
							label={<Label>Time</Label>}
							onDateChange={(time: Date, inputStr: string) => {
								if (!isValidDate(time)) {
									addFieldError(form, name, "Invalid time")
								} else {
									removeFieldError(form, name, "Invalid time")
									// Timepicker assumes browser local
									// timezone, so we need to modify the value
									// for the user's timezone setting.
									const timeWithTz = setTimezonePreserveClockTime(
										timezone,
										time
									)
									const value = mergeDateAndTime({
										date: moment.tz(field.value || timeWithTz, timezone),
										time: timeWithTz
									}).toDate()
									form.setFieldValue(name, value)
								}
							}}
							formatter={(date: ?Date): string =>
								date ? moment(date).format("LT") : ""
							}
							parser={(input: string) =>
								// Use strict parsing to prevent the input value
								// from changing erratically while the user is
								// editing the time. "LT" specifies time-only format
								// for the user's locale.
								//
								// Parse assuming browser local timezone. We
								// convert to the user's chosen timezone in the
								// `onDateChange` method.
								moment(input, "LT", true).toDate()
							}
							value={
								// Convert to browser local timezone so that
								// Timepicker displays the time correctly.
								setTimezonePreserveClockTime(
									null,
									moment.tz(field.value, timezone)
								).toDate()
							}
						/>
					) : null}
				</FieldSet>
			)}
		/>
	)
}

function FieldSet({
	children,
	containerClassName,
	errorMessage,
	label
}: {
	children: React.Node,
	containerClassName?: string | string[],
	errorMessage?: ?string,
	label: string
}) {
	return (
		<div
			className={classNames(
				"slds-form-element",
				{ "slds-has-error": !!errorMessage },
				containerClassName
			)}
		>
			<div className="slds-form-element__control">
				<legend className="slds-form-element__label">{label}</legend>
				<div className="slds-grid slds-gutters_x-small">{children}</div>
			</div>
			{errorMessage ? (
				<div className="slds-form-element__help">{errorMessage}</div>
			) : null}
		</div>
	)
}

// These functions do a bit of extra state juggling to accomodate the fact that
// we treat two distinct inputs as one field in the managed form, and so they
// share error state.
function addFieldError(form: Object, fieldName: string, message: string) {
	const fieldErrors = getFieldErrors(form, fieldName)
	if (!fieldErrors.includes(message)) {
		fieldErrors.push(message)
	}
	form.setFieldError(fieldName, fieldErrors.join(", "))
}

function removeFieldError(form: Object, fieldName: string, message: string) {
	setFieldErrors(
		form,
		fieldName,
		getFieldErrors(form, fieldName).filter(e => e !== message)
	)
}

function getFieldErrors(form: Object, fieldName: string): string[] {
	return (form.errors[fieldName] || "").split(", ").filter(x => !!x)
}

function setFieldErrors(form: Object, fieldName: string, errors: string[]) {
	const message = errors.join(", ")
	if (message) {
		form.setFieldError(fieldName, message)
	} else {
		const errors = { ...form.errors }
		delete errors[fieldName]
		form.setErrors(errors)
	}
}

/*
 * `isValidDate` checks whether a date is valid. An error parsing the date or
 * time inputs will yield an "Invalid Date", which returns `NaN` from its
 * `.getTime()` method.
 */
function isValidDate(date: Date): boolean {
	return moment(date).isValid()
}
