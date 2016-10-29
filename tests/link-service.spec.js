/* link service tests
 */

var test = require('tape')
var Nedb = require('nedb')
var config = require('../config/config')
var db = new Nedb({
  filename: config.dbLinks + '.test',
  autoload: true
})

var linkService = require('../link-service')(db)

test('create link', function (t) {
  t.plan(3)

  linkService.create({
    long_url: '',
  }, function (err, res) {
    t.ok(err, 'should throw hostname error')
  })

  linkService.create({
    long_url: 'http://www.siloz.io/1'
  }, function (err, res) {
    db.findOne({
      long_url: 'http://www.siloz.io/1'
    }, function (err, link) {
      t.equal(link.long_url, 'http://www.siloz.io/1', 'should create link without session')
    })
  })

  linkService.create({
    long_url: 'http://www.siloz.io/2',
    session: '1234'
  }, function (err, res) {
    db.findOne({
      long_url: 'http://www.siloz.io/2'
    }, function (err, link) {
      t.equal(link.session, '1234', 'should create link with session')
    })
  })
})

test('update link', function (t) {
  t.plan(2)

  linkService.create({
    long_url: 'http://www.siloz.io/3',
    session: '1234'
  }, function (err, link) {
    linkService.update({
      short_url: link.short_url,
      long_url: 'http://www.siloz.io/4',
      session: '123'
    }, function (err, res) {
      t.ok(err, 'should throw session error')
    })
  })

  linkService.create({
    long_url: 'http://www.siloz.io/3',
    session: '1234'
  }, function (err, link) {
    linkService.update({
      short_url: link.short_url,
      session: link.session,
      long_url: 'http://www.siloz.io/4'
    }, function (err, res) {
      t.equal(res.long_url, 'http://www.siloz.io/4', 'should update long_url')
    })
  })
})

test('find link', function (t) {
  t.plan(2)

  linkService.create({
    long_url: 'http://www.siloz.io/5'
  }, function (err, link) {
    linkService.find({
      short_url: '123'
    }, function (err, res) {
      t.ok(err, 'should throw not found error')
    })
  })

  linkService.create({
    long_url: 'http://www.siloz.io/5'
  }, function (err, link) {
    linkService.find({
      short_url: link.short_url
    }, function (err, res) {
      t.equal(res.long_url, 'http://www.siloz.io/5', 'should find link')
    })
  })
})
