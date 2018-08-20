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

/*
 * possible signatures are:
 *
 *     define(moduleName: string, depNames: string[], factory: Function)
 *     define(depNames: string[], factory: Function)
 *
 */
function define(...args: any[]) {
	const moduleName: ?string = typeof args[0] === "string" ? args.shift() : null
	const depNames: string[] = args.shift()
	const factory: Function = args.shift()
	const referenceDir = path.dirname(caller())
	const deps = depNames.map(n => {
		// $FlowFixMe: do not attempt to type-check dynamic import
		return require(resolveModulePath(referenceDir, n))
	})
	return factory.apply(null, deps)
}

/*
 * A module checks for AMD support by testing for a globally-scoped function
 * called `define` with a truthy `amd` property. We want to provide an AMD
 * loader for jquery and jquery UI (which are not designed to work with
 * CommonJS); but we do not want tslib to use the AMD loader, because it can
 * export itself via CommonJS. So we define the `amd` property using a getter
 * which returns a truthy value if-and-only-if the caller is a jquery module.
 */
Object.defineProperty(define, "amd", {
	get() {
		if (caller().match(/node_modules\/jquery/)) {
			return {}
		}
	}
	// Flow reports an error if there is no `value` property in a property
	// descriptor. This specially-formatted comment is visible to Flow, but is
	// not included at runtime.
	/*::, value: {} */
})

function resolveModulePath(relativeTo: string, n: string): string {
	if (!n.startsWith(".") && !n.startsWith("/")) {
		return n
	}
	return path.resolve(relativeTo, n)
}

export default define
global.define = define
