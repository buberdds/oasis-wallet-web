// @ts-check
const execSync = require('child_process').execSync
const { getCsp } = require('./getCsp.js')
const { buildDatetime, buildSha } = require('./getBuildData')

process.env.REACT_APP_BUILD_DATETIME = buildDatetime
process.env.REACT_APP_BUILD_SHA = buildSha
process.env.EXTENSION_CSP = getCsp({ isExtension: true })

console.log(`Content-Security-Policy: ${process.env.EXTENSION_CSP}\n`)

execSync(
  'yarn clean:ext && parcel build --target ext --dist-dir build-ext && node ./internals/scripts/validate-ext-manifest.js',
  {
    stdio: 'inherit',
  },
)
