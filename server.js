/* prajina
 */

var config = require('./config/config')
var configPrivate = require('./config/private.json')

var express = require('express')
var app = express()

var Nedb = require('nedb')
var links = new Nedb({
  filename: config.dbLinks,
  autoload: true
})

var linkService = require('./link-service')(links, configPrivate)

// api server
var api = require('./routes/api')(linkService)
app.use('/api/', api)

// shorturl resolver
var resolve = require('./routes/resolve')(linkService)
app.use('/', resolve)

module.exports = app.listen(config.port, config.ip)
