/* @flow strict */

import * as React from "react"
import replace from "react-string-replace"
import { type Labels } from "../../models/CustomLabel"

const { Consumer, Provider } = React.createContext({})

export const LabelProvider: React.ComponentType<{ value: Labels }> = Provider

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

const tokenPattern = /\{(.*?)\}/

export function getLabel(
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

/*
 * We use the `<Label/>` component to provide translated text to label props in
 * SLDS components. It works - but the relevant props expect the type `string`,
 * which results in many error messages in the console when running in
 * development.  This code patches `console.error` in development and testing to
 * suppress those messages.
 */
if (process.env.NODE_ENV !== "production") {
	const origError = console.error
	const labelPropTypePattern = /Invalid prop `(?:label|labels\.label|assistiveText)` of type `object` supplied/
	// $FlowFixMe
	console.error = function error(message) {
		if (typeof message === "string" && message.match(labelPropTypePattern)) {
			return
		} else {
			return origError.apply(this, arguments)
		}
	}
}
