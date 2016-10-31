/* data service
 */

var url = require('url')
var bs58 = require('base58')
var util = require('./util')

var config = require('./config/config')
var Nedb = require('nedb')
var db = new Nedb({
  filename: config.dbLinks,
  autoload: true
})

var sessionService = require('./session-service')

function checkHostname (fullUrl) {
  var parsedUrl = url.parse(fullUrl)

  if (parsedUrl.hostname !== config.linkHostname) {
    return false
  }

  return true
}

function Service () {
  var count = 0
  db.count({}, function (err, c) {
    if (err) {}

    count = c
  })

  function create (data, callback) {
    data = util.extend(data, {
      long_url: ''
    })

    // restrict by hostname
    if (!checkHostname(data.long_url)) {
      return callback({
        status: 403,
        error: 'Hostname doesn\'t match.'
      })
    }

    var uid = count++

    var link = {
      long_url: data.long_url,
      short_url: bs58.encode(uid),
      updated_at: new Date()
    }

    // create session and return token
    sessionService.create({}, function (err, session) {
      if (err) {
        return callback(err)
      }

      link.session = session._id

      db.insert(link, function (err, link) {
        if (err) {
          return callback(err)
        }

        // add token to link
        link.token = session.token

        callback(err, link)
      })
    })
  }

  function update (data, callback) {
    data = util.extend(data, {
      short_url: '',
      long_url: '',
      token: ''
    })

    db.findOne({ short_url: data.short_url }, function (err, link) {
      if (err) {
        return callback(err)
      }

      if (!link) {
        return callback({
          status: 403,
          error: 'Couldn\'t find short url.'
        })
      }

      // restrict url
      if (!checkHostname(data.long_url)) {
        return callback({
          status: 403,
          error: 'Hostname doesn\'t match.'
        })
      }

      // TODO find session
      sessionService.find({
        _id: link.session
      }, function (err, session) {
        if (err) {
          return callback(err)
        }

        // make sure session matches
        if (data.token !== session.token) {
          return callback({
            status: 403,
            error: 'Session doesn\'t match.'
          })
        }

        // update session
        sessionService.update({
          _id: link.session
        }, function (err) {
          if (err) {
            return callback(err)
          }

          // update long_url
          db.update({
            _id: link._id
          }, {
            $set: {
              long_url: data.long_url,
              updated_at: new Date()
            }
          }, {
            returnUpdatedDocs: true
          }, function (err, num, docs) {
            callback(err, docs)
          })
        })
      })
    })
  }

  function find (data, callback) {
    data = util.extend(data, {
      short_url: ''
    })

    db.findOne({ short_url: data.short_url }, function (err, link) {
      if (err || !link) {
        return callback({
          status: 403,
          error: 'Couldn\'t find short url.'
        })
      }

      callback(null, link)
    })
  }

  return {
    create: create,
    find: find,
    update: update
  }
}

module.exports = Service()
