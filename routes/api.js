/* api
 */

var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var cors = require('cors')

var config = require('../config/config')

router.use(bodyParser.json())
router.use(cors({
  origin: config.corsWhitelist
}))

function Api (service) {
  router.post('/', function (req, res) {
    // create link
    service.create(req.body, function (err, data) {
      if (err) {
        return res.status(err.status || 500).json(err)
      }

      res.json({
        short_url: data.link.short_url,
        token: data.session.token
      })
    })
  })

  router.put('/', function (req, res) {
    // update link
    service.update(req.body, function (err, data) {
      if (err) {
        return res.status(err.status || 500).json(err)
      }

      res.json({
        short_url: data.link.short_url
      })
    })
  })

  return router
}

module.exports = Api
