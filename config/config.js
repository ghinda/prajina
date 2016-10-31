/* prajina
 */

var config = {}

// detect environment
function getEnvironment () {
  var nodeEnv = process.env.OPENSHIFT_APP_NAME
  if (typeof nodeEnv !== 'undefined') {
    return nodeEnv
  }

  return 'local'
}

function getPort (env) {
  if (env !== 'local') {
    return process.env.OPENSHIFT_NODEJS_PORT
  }

  return 3000
}

function getIp (env) {
  if (env !== 'local') {
    return process.env.OPENSHIFT_NODEJS_IP
  }

  return '127.0.0.1'
}

function getLinkHostname (env) {
  if (env !== 'local') {
    return 'www.siloz.io'
  }

  return 'localhost'
}

config.env = getEnvironment()

config.dirData = 'data'

config.dbLinks = config.dirData + '/links.json'
config.dbSession = config.dirData + '/session.json'

config.port = getPort(config.env)
config.ip = getIp(config.env)

config.linkHostname = getLinkHostname(config.env)

config.corsWhitelist = [
  'http://localhost',
  'http://www.siloz.io'
]

module.exports = config
