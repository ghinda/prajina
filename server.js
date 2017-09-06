/* prajina
 */

var config = require('./config/config')

var express = require('express')
var app = express()

var linkService = require('./link-service')

// static
if (config.dirStatic) {
  app.use(express.static(config.dirStatic, {dotfiles:'allow'}))
}

// api server
var api = require('./routes/api')(linkService)
app.use('/api/', api)

// health
app.get('/health', function (req, res) {
  res.send()
})

// shorturl resolver
var resolve = require('./routes/resolve')(linkService)
app.use('/', resolve)

// root
app.get('/', function (req, res) {
  res.send()
})

module.exports = app.listen(config.port, config.ip, function () {
  console.log(config.ip + ':' + config.port)
})
