/*
 * Configures test environment for frontend React app tests
 *
 * @flow strict
 */

import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

configure({ adapter: new Adapter() })
