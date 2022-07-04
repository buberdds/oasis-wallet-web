// @ts-check
const buildSha = require('child_process').execSync('git rev-parse HEAD').toString().trim()
const buildDatetime = Date.now().toString()

module.exports = { buildDatetime, buildSha }
