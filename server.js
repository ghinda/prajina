/* prajina
 */

var config = require('./config/config')

var express = require('express')
var app = express()

var linkService = require('./link-service')

// api server
var api = require('./routes/api')(linkService)
app.use('/api/', api)

// shorturl resolver
var resolve = require('./routes/resolve')(linkService)
app.use('/', resolve)

module.exports = app.listen(config.port, config.ip)
