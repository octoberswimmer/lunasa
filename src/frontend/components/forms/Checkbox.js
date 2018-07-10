/* @flow strict */

import SLDSCheckbox from "@salesforce/design-system-react/components/checkbox"
import { Field } from "formik"
import * as React from "react"

type Props = {
	label: string,
	name: string
}

export default function Checkbox({ name, label, ...rest }: Props) {
	return (
		<Field
			name={name}
			render={({ form, field }) => (
				<SLDSCheckbox
					checked={Boolean(field.value)}
					errorText={form.errors[name]}
					label={label}
					name={name}
					onBlur={field.onBlur}
					onChange={(event, { checked }) => {
						form.setFieldValue(name, checked)
					}}
					{...rest}
				/>
			)}
		/>
	)
}
