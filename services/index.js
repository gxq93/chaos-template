const demo = require('./demo/index')
const packageInfo = require('../package.json')

module.exports = {
  demo,
  version: packageInfo.version
}
