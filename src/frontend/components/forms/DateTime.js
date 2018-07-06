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
import moment from "moment"
import * as React from "react"

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
	showTime?: boolean
}

// TODO: input values should be editable by typing
export default function DateTime({
	containerClassName,
	label,
	name,
	showTime
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
						labels={{ label: "Date" }}
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
								form.setFieldValue(
									name,
									mergeDateAndTime({
										date,
										time: field.value || date
									})
								)
							}
						}}
						formatter={(date: ?Date): string =>
							// Date given `T00:00` UTC; so we use `.utc()` to
							// avoid off-by-one-day errors. The "L" format
							// string outputs date only according to the
							// user's locale.
							date
								? moment(date)
										.utc()
										.format("L")
								: ""
						}
						parser={(inputStr: string) => moment(inputStr, "L", true).toDate()}
						triggerClassName="slds-col"
						value={field.value}
					/>
					{showTime !== false ? (
						<Timepicker
							label="Time"
							onDateChange={(time: Date, inputStr: string) => {
								if (!isValidDate(time)) {
									addFieldError(form, name, "Invalid time")
								} else {
									removeFieldError(form, name, "Invalid time")
									form.setFieldValue(
										name,
										mergeDateAndTime({
											date: field.value || time,
											time
										})
									)
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
								moment(input, "LT", true).toDate()
							}
							value={field.value}
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
 * `mergeDateAndTime` creates a new `Date` value that combines the date of one
 * input with the time-of-day of the other input.
 */
function mergeDateAndTime({ date, time }: { date: Date, time: Date }): Date {
	const result = new Date(time)
	// Use `getUTC*` methods to prevent date recalculation. `Datepicker`
	// provides a date with its time set to `T00:00` UTC.
	result.setFullYear(date.getUTCFullYear())
	result.setMonth(date.getUTCMonth())
	result.setDate(date.getUTCDate())
	return result
}

/*
 * `isValidDate` checks whether a date is valid. An error parsing the date or
 * time inputs will yield an "Invalid Date", which returns `NaN` from its
 * `.getTime()` method.
 */
function isValidDate(date: Date): boolean {
	return moment(date).isValid()
}
