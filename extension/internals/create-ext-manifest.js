const fs = require('fs')

const manifest = require('../src/source-manifest.json')
const { csp } = require('../../internals/getCsp')

const updatedManifest = { ...manifest }
updatedManifest.content_security_policy = csp({ extension: true })

try {
  fs.writeFileSync('./extension/src/manifest.json', JSON.stringify(updatedManifest), 'utf-8')
} catch (error) {
  console.log(error)
}
