/* data service
 */

var url = require('url')
var bs58 = require('base58')
var util = require('./util')

function Service (db, configPrivate) {
  var count = 0
  db.count({}, function (err, c) {
    count = c
  })

  function checkHostname (fullUrl) {
    var parsedUrl = url.parse(fullUrl)

    if (parsedUrl.hostname !== configPrivate.hostname) {
      return false
    }

    return true
  }

  function create (data, callback) {
    data = util.extend(data, {
      long_url: ''
    })

    // restrict by hostname
    if (!checkHostname(data.long_url)) {
      return callback({
        error: 'Hostname doesn\'t match.'
      })
    }

    var uid = count++

    // if no session, generate one
    var session = data.session || util.guid()

    var link = {
      long_url: data.long_url,
      short_url: bs58.encode(uid),
      created_at: new Date(),
      updated_at: new Date(),
      session: session
    }

    db.insert(link, callback)
  }

  function update (data, callback) {
    data = util.extend(data, {
      short_url: '',
      long_url: '',
      session: ''
    })

    db.findOne({ short_url: data.short_url }, function (err, link) {
      if (err || !link) {
        return callback({
          error: 'Couldn\'t find short url.'
        })
      }

      // make sure session matches
      if (data.session !== link.session) {
        return callback({
          error: 'Session doesn\'t match.'
        })
      }

      // restrict url
      if (!checkHostname(data.long_url)) {
        return callback({
          error: 'Hostname doesn\'t match.'
        })
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
  }

  function find (data, callback) {
    data = util.extend(data, {
      short_url: ''
    })

    db.findOne({ short_url: data.short_url }, function (err, link) {
      if (err || !link) {
        return callback({
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

module.exports = Service
