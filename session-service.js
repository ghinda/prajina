/* session service
 */

var util = require('./util')

var config = require('./config/config')
var Nedb = require('nedb')
var db = new Nedb({
  filename: config.dbSession,
  autoload: true
})

function Session () {
  function create (data, callback) {
    data = util.extend(data, {
      token: ''
    })

    // generate token
    var session = {
      token: util.guid()
    }

    db.insert(session, callback)
  }

  function find (data, callback) {
    db.findOne(data, function (err, session) {
      if (err || !session) {
        return callback({
          status: 403,
          error: 'Couldn\'t find short session.'
        })
      }

      callback(null, session)
    })
  }

  return {
    create: create,
    find: find
  }
}

module.exports = Session()
