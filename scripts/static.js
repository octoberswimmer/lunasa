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
 */

const child_process = require('child_process')
const fs = require('fs')
const { basename, join, resolve } = require('path')

// The asset manifest is created by the create-react-app build script
const assets = JSON.parse(fs.readFileSync(join('build', 'asset-manifest.json')))

const resourceName = process.argv[process.argv.length - 1]
const staticResourcePath = join('src', 'staticresources', `${resourceName}.resource`)
const zipDir = join('build', 'zip')

createZipDirectory(zipDir)
copyAssets('build', zipDir)
deployZip(zipDir, staticResourcePath)

function createZipDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

// create-react-app builds assets with cache-busting hashes in the filenames.
// But it also generates an asset manifest with a mapping from stable names to
// generated files. This function copies the latest version of each asset to
// a path with a stable name.
function copyAssets(inputDir, outputDir) {
  for (const [name, path] of Object.entries(assets)) {
    // Preserve hash in names of `*.map` files - references to those names are
    // compiled into the js and css bundles.
    const destName = name.endsWith('.map') ? basename(path) : name
    fs.copyFileSync(
      join(inputDir, path),
      join(outputDir, destName)
    )
  }
}

function deployZip(inputDir, outputPath) {
  // First remove the existing zip file
  if (fs.existsSync(staticResourcePath)) {
    fs.unlinkSync(staticResourcePath)
  }
  child_process.spawnSync('zip', ['-rj', outputPath, inputDir], {
    stdio: 'inherit'
  })
}
