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
			// Apply Babel transformations to @salesforce/design-system-react
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

			// @salesforce-ux/design-system provides several assets with the
			// same name, `symbols.svg`, which leads to a name conflict in the
			// Webpack file-loader configuration. This modifies the file-loader
			// configuration to incorporate the path to a resource in generated
			// file names, as opposed to basing generated names solely on the
			// basename of the asset.
			if (
				node &&
				typeof node.name === "string" &&
				node.name.match(/static\/media\//)
			) {
				this.update({
					...node,
					name: "static/media/[path][name].[hash:8].[ext]"
				})
			}
		})

		// Add expose-loader to expose jQuery so
		// jquery-ui-touch-punch can find the jQuery global
		config.module.rules.push({
			test: require.resolve("jquery"),
			use: [
				{
					loader: "expose-loader",
					options: "$"
				},
				{
					loader: "expose-loader",
					options: "jQuery"
				}
			]
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
