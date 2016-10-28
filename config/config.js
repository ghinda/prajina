/* prajina
 */

var config = {}

// detect environment
function getEnvironment () {
  var nodeEnv = process.env.NODE_ENV
  if (typeof nodeEnv !== 'undefined') {
    return nodeEnv
  }

  return 'local'
}

function getPort (env) {
  return 3000
}

config.env = getEnvironment()

config.dirData = 'data'

config.dbLinks = config.dirData + '/links.json'

config.port = getPort(config.env)

module.exports = config
