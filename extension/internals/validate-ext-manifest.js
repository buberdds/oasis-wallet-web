const manifest = require('../../build-ext/manifest.json')

if (manifest.content_security_policy.includes('CSP_POLICY_TOKEN')) {
  console.log('CSP was not generated in the manifest.json file')
  process.exit(1)
} else {
  process.exit(0)
}
