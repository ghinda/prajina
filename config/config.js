/* prajina
 */

var config = {}

// detect environment
function getEnvironment () {
  var nodeEnv = process.env.OPENSHIFT_APP_NAME
  if (typeof nodeEnv !== 'undefined') {
    return nodeEnv.toLowerCase()
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

function getDataDir (env) {
  if (env === 'test') {
    return 'tests/data'
  }

  return 'data'
}

function getCorsWhitelist (env) {
  if (env !== 'local') {
    return 'http://localhost'
  }

  return 'http://www.siloz.io'
}

config.env = getEnvironment()

config.dirData = getDataDir(config.env)

config.dbLinks = config.dirData + '/links.json'
config.dbSession = config.dirData + '/session.json'

config.port = getPort(config.env)
config.ip = getIp(config.env)

config.linkHostname = getLinkHostname(config.env)

config.corsWhitelist = getCorsWhitelist(config.env)

module.exports = config
