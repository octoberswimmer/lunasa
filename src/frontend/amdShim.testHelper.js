/*
 * This module installes a global variable, `define`, that implements AMD module
 * loading using CommonJS to look up modules. This is a shim for dependencies
 * that use AMD to load dependencies, such as jQuery UI.
 *
 * This shim is not necessary in production because Webpack will automatically
 * handle AMD loading. This shim is useful in tests.
 *
 * @flow strict
 */

import caller from "caller"
import * as path from "path"

function define(depNames: string[], factory: Function) {
	const referenceDir = path.dirname(caller())
	const deps = depNames.map(n => {
		// $FlowFixMe: do not attempt to type-check dynamic import
		return require(resolveModulePath(referenceDir, n))
	})
	return factory.apply(null, deps)
}
define.amd = {}

function resolveModulePath(relativeTo: string, n: string): string {
	if (!n.startsWith(".") && !n.startsWith("/")) {
		return n
	}
	return path.resolve(relativeTo, n)
}

export default define
global.define = define
