/* api
 */

var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.json())

function Api (service) {
  router.post('/', function (req, res) {
    // create link
    service.create(req.body, function (err, link) {
      if (err) {
        return res.status(err.status || 500).json(err)
      }

      res.json(link)
    })
  })

  router.put('/', function (req, res) {
    // update link
    service.update(req.body, function (err, link) {
      if (err) {
        return res.status(err.status || 500).json(err)
      }

      res.json(link)
    })
  })

  return router
}

module.exports = Api
