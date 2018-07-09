/*
 * Bundle frontend assets into a zip file that is placed in the
 * `src/staticresources` Salesforce resource directory.
 * For example:
 *
 *     node static.js ShippingAddressUpdate
 *
 * Will create a zip file containing `main.js`, `main.js.map`, `main.css`, and
 * `main.css.map`, and will put that file at
 * `src/staticresources/ShippingAddressUpdate.resource`
 *
 * @flow strict
 */

const child_process = require("child_process")
const fs = require("fs")
const path = require("path")

// The asset manifest is created by the create-react-app build script
const assets /*: { [key: string]: string } */ = JSON.parse(
	fs.readFileSync(path.join("build", "asset-manifest.json"), "utf8")
)

const resourceName = process.argv[process.argv.length - 1]
const staticResourcePath = path.join(
	"src",
	"staticresources",
	`${resourceName}.resource`
)
const zipDir = path.join("build", "zip")

createZipDirectory(zipDir)
copyAssets("build", zipDir)
deployZip(zipDir, staticResourcePath)

function createZipDirectory(dir) {
	// Clean up any existing zip directory
	rimraf(dir)
	fs.mkdirSync(dir)
}

// create-react-app builds assets with cache-busting hashes in the filenames.
// But it also generates an asset manifest with a mapping from stable names to
// generated files. This function copies the latest version of each asset to
// a path with a stable name.
function copyAssets(inputDir, outputDir) {
	for (const [assetName, assetPath] of Object.entries(assets)) {
		if (typeof assetPath !== "string") {
			throw new Error("expected asset path to be a string")
		}
		// Remove dynamically-generated cache-busting component from js and css
		// file names so that those files can be referenced in an Apex page.
		const destPath =
			assetName.endsWith(".js") || assetName.endsWith(".css")
				? stripCacheBusting(assetPath)
				: assetPath
		mkdirp(path.join(outputDir, path.dirname(destPath)))
		fs.copyFileSync(
			path.join(inputDir, assetPath),
			path.join(outputDir, destPath)
		)
	}
}

function stripCacheBusting(assetPath) {
	return assetPath.replace(/\.[0-9a-f]{8}/, "")
}

function mkdirp(dir) {
	const components = dir.split(path.sep)
	for (var i = 1; i <= components.length; i += 1) {
		const subdir = path.join(...components.slice(0, i))
		if (!fs.existsSync(subdir)) {
			fs.mkdirSync(subdir)
		}
	}
}

/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dir_path) {
	if (fs.existsSync(dir_path)) {
		fs.readdirSync(dir_path).forEach(function(entry) {
			var entry_path = path.join(dir_path, entry)
			if (fs.lstatSync(entry_path).isDirectory()) {
				rimraf(entry_path)
			} else {
				fs.unlinkSync(entry_path)
			}
		})
		fs.rmdirSync(dir_path)
	}
}

function deployZip(inputDir, outputPath) {
	// First remove the existing zip file
	if (fs.existsSync(staticResourcePath)) {
		fs.unlinkSync(staticResourcePath)
	}
	child_process.spawnSync(
		"zip",
		["-r", path.relative(inputDir, outputPath), "."],
		{
			cwd: inputDir,
			stdio: "inherit"
		}
	)
}
