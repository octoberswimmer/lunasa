/*
 * Configures test environment for frontend React app tests
 *
 * @flow strict
 */

import sldsSettings from "@salesforce/design-system-react/components/settings"
import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

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
