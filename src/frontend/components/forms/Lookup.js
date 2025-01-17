import React from "react"
import SLDSLookup from "@salesforce/design-system-react/components/lookup"
import PropTypes from "prop-types"
import { Field } from "formik"

class SalesforceLookup extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedIndex: -1,
			isDirty: false
		}
	}

	lookup({ field, form }) {
		const { label, name, options, placeholder, value } = this.props
		if (value && !this.state.isDirty) {
			this.setState({ isDirty: true })
			const index = options.map(e => e.id).indexOf(value.value)
			if (index >= 0) {
				this.setState({ selectedIndex: index })
			} else {
				options.unshift(value)
				this.setState({ selectedIndex: -0 })
			}
		}
		const events = {
			onChange: value => {
				this.setState({ selectedIndex: -1, isDirty: true })
				form.setFieldValue("searchTerm", value)
			},
			onSelect: selection => {
				this.value = selection
				const selectionId = selection.id
				if (selectionId) {
					form.setFieldValue(name, selectionId)
					this.setState({ isDirty: true })
				}
			},
			onUnselect: () => {
				this.setState({ selectedIndex: -1, isDirty: true })
				form.setFieldValue(name, null)
			}
		}
		return (
			<SLDSLookup
				label={label}
				placeholder={placeholder}
				options={options}
				value={value}
				selectedItem={this.state.selectedIndex}
				onChange={content => {
					events.onChange(content)
				}}
				onSelect={selection => {
					events.onSelect(selection)
				}}
				onUnselect={() => {
					events.onUnselect()
				}}
			/>
		)
	}

	render() {
		const { name } = this.props

		return <Field name={name} render={formik => this.lookup(formik)} />
	}
}

SalesforceLookup.propTypes = {
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired
}

SalesforceLookup.defaultProps = {
	onChange: () => {},
	label: "Default",
	placeholder: "Default",
	options: []
}

export default SalesforceLookup
