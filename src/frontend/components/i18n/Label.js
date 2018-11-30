/* @flow strict */

import * as React from "react"
import replace from "react-string-replace"
import { type Labels } from "../../models/CustomLabel"

const { Consumer, Provider } = React.createContext({})

export const LabelProvider: React.ComponentType<{
	value: Labels,
	children?: React$Node
}> = Provider

// `Label` takes a custom label name as a child and renders a translated string.
// You may also pass a map of substitution values via the `with` prop.
// Substitution values may be React nodes. For example:
//
//     <Label with={{ subject: <b>event.Subject<b> }}>
//         Edit_Event
//     </Label>
//
// Use `Label` in cases where a React node is permissible. If you need a string
// value then use the `WithLabels` component.
export function Label(props: {
	children: string,
	with?: { [key: string]: React.Node }
}) {
	return (
		<Consumer>
			{labels => getLabel(labels, props.children, props.with)}
		</Consumer>
	)
}

// `WithLabels` uses the Function as Child Component pattern to provide access
// to i18n labels.
//
// https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9
//
// Use this component when you want to use translated strings in a context where
// a string is required, and a React node will not work. For example:
//
//     function Loading() {
//         <WithLabels>
//             {label => <img alt={label("Loading")} src="spinner.gif" />}
//         </WithLabels>
//     }
//
// `WithLabels` accepts a child which should be a function that accepts
// a function to resolve a label name and substitution values to a string, and
// returns a React Node.
export function WithLabels({
	children
}: {
	children: (
		label: (key: string, substitutions?: { [key: string]: string }) => string
	) => React.Node
}) {
	return (
		<Consumer>
			{labels => children(getLabelAsString.bind(null, labels))}
		</Consumer>
	)
}

const tokenPattern = /\{(.*?)\}/g

function getLabel(
	labels: Labels,
	name: string,
	substitutions: { [key: string]: React.Node } = {}
): React.Node {
	const label = labels[name]
	if (!label) {
		console.error(`Label not found, "${name}"`)
		return name
	}
	return replace(label, tokenPattern, (token, start, end) => {
		const replacement = substitutions[token.trim()]
		switch (typeof replacement) {
			case "undefined":
				// If no substitution is given then preserve the original text.
				return `{${token}}`
			case "object":
				if (!replacement) {
					// null check
					return replacement
				}
				// Replacements will be members of an array. React prefers that
				// non-string array element nodes have a `key` property.
				return React.cloneElement(replacement, {
					key: `${token}-${start}-${end}`
				})
			default:
				return replacement
		}
	})
}

function getLabelAsString(
	labels: Labels,
	name: string,
	substitutions: { [key: string]: string } = {}
): string {
	const label = labels[name]
	if (!label) {
		console.error(`Label not found, "${name}"`)
		return name
	}
	return label.replace(tokenPattern, (substitutionExpression, param) => {
		const replacement = substitutions[param.trim()]
		switch (typeof replacement) {
			case "undefined":
				// If no substitution is given then preserve the original text.
				return substitutionExpression
			default:
				return replacement
		}
	})
}

/*
 * We use the `<Label/>` component to provide translated text to label props in
 * SLDS components. It works - but the relevant props expect the type `string`,
 * which results in many error messages in the console when running in
 * development.  This code patches `console.error` in development and testing to
 * suppress those messages.
 */
if (process.env.NODE_ENV !== "production") {
	const origError = console.error
	const labelPropTypePattern = /Invalid prop `(?:label|labels\.label|assistiveText|errorText)` of type `object` supplied/
	// $FlowFixMe
	console.error = function error(message) {
		if (typeof message === "string" && message.match(labelPropTypePattern)) {
			return
		} else {
			return origError.apply(this, arguments)
		}
	}
}
