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
