/* prajina
 */

var config = {}

// detect environment
function getEnvironment () {
  var nodeEnv = process.env.NODE_ENV
  if (typeof nodeEnv !== 'undefined') {
    return nodeEnv.toLowerCase()
  }

  return 'local'
}

function getPort (env) {
  if (env !== 'local') {
    return 8080
  }

  return 3000
}

function getIp (env) {
  if (env !== 'local') {
    return 'localhost'
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
  } else if (env !== 'local') {
    return process.env.DATA_DIR
  }

  return 'data'
}

function getCorsWhitelist (env) {
  if (env !== 'local') {
    return 'https://www.siloz.io'
  }

  return 'http://localhost:9000'
}

function getStaticDir (env) {
  return process.env.STATIC_DIR
}

config.env = getEnvironment()

config.dirData = getDataDir(config.env)
config.dirStatic = getStaticDir(config.env)

config.dbLinks = config.dirData + '/links.json'
config.dbSession = config.dirData + '/session.json'

config.port = getPort(config.env)
config.ip = getIp(config.env)

config.linkHostname = getLinkHostname(config.env)

config.corsWhitelist = getCorsWhitelist(config.env)

module.exports = config
