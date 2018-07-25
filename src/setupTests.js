/*
 * Configures test environment for frontend React app tests
 *
 * @flow strict
 */

import sldsSettings from "@salesforce/design-system-react/components/settings"
import ElementFocus from "@salesforce/design-system-react/utilities/dom-element-focus"
import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import "jest-enzyme"

// jQuery UI uses AMD to load dependencies. That works fine in production
// because Webpack provides an AMD loader. But in testing we need a shim.
import "./frontend/amdShim.testHelper.js"

configure({ adapter: new Adapter() })

// Create an element for rendering assistive-technology-supporting elements.
// Without these we get a lot of warnings when rendering modals.
sldsSettings.setAppElement(document.createElement("div"))

/*
 * Simple polyfill for `document.createRange` so that we can test the SLDS
 * Combobox component.
 */
class Range {
	commonAncestorContainer: Node
	createContextualFragment(html) {
		const div = document.createElement("div")
		div.innerHTML = html
		return div.children[0]
	}
	setStart(startNode: Node, startOffset: number) {
		this.commonAncestorContainer = startNode
	}
	setEnd(endNode: Node, endOffset: number) {
		this.commonAncestorContainer = endNode
	}
}
global.window.document.createRange = () => new Range()

// Suppress element focus warning from SLDS in testing
ElementFocus.returnFocusToStoredElement = function returnFocusToStoredElement() {}
