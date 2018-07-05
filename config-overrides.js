/*
 * Customize create-react-app's Webpack configurating using react-app-rewired.
 * See: https://github.com/timarney/react-app-rewired
 *
 * @flow strict
 */
const path = require("path")
const traverse = require("traverse")

module.exports = {
	webpack(config /*: Object */, env /*: Object */) {
		traverse(config).forEach(function(node) {
			if (
				node &&
				typeof node.loader === "string" &&
				node.loader.match(/babel-loader/)
			) {
				this.update({
					...node,
					include: [
						path.join(__dirname, "node_modules/@salesforce/design-system-react")
					].concat(node.include)
				})
			}
		})
		return config
	},
	jest(config /*: Object */) {
		config.transformIgnorePatterns = [
			// Apply Babel transformations to @salesforce dependencies, but not
			// to other node modules.
			"[/\\\\]node_modules[/\\\\](?!@salesforce[/\\\\]).+\\.(js|jsx|mjs)$"
		]
		return config
	}
}
