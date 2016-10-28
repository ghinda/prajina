/* url resolver
 */

var express = require('express')
var router = express.Router()

function Resolve (service) {
  router.get('/:short_url', function (req, res) {
    service.find({
      short_url: req.params.short_url
    }, function (err, link) {
      if (err) {
        return res.json(err)
      }

      res.redirect(link.long_url)
    })
  })

  return router
}

module.exports = Resolve
