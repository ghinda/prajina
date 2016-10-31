/* link service tests
 */

var test = require('tape')
var linkService = require('../link-service')

test('create link', function (t) {
  t.plan(2)

  linkService.create({
    long_url: ''
  }, function (err, res) {
    t.ok(err, 'should throw hostname error')
  })

  linkService.create({
    long_url: 'http://www.siloz.io/1'
  }, function (e, res) {
    t.equal(res.long_url, 'http://www.siloz.io/1', 'should create link')
  })
})

test('update link', function (t) {
  t.plan(2)

  linkService.create({
    long_url: 'http://www.siloz.io/3'
  }, function (e, link) {
    linkService.update({
      short_url: link.short_url,
      long_url: 'http://www.siloz.io/4',
      token: '123'
    }, function (err, res) {
      t.ok(err, 'should throw session error')
    })
  })

  linkService.create({
    long_url: 'http://www.siloz.io/3'
  }, function (e, link) {
    linkService.update({
      short_url: link.short_url,
      token: link.token,
      long_url: 'http://www.siloz.io/4'
    }, function (e, res) {
      t.equal(res.long_url, 'http://www.siloz.io/4', 'should update long_url')
    })
  })
})

test('find link', function (t) {
  t.plan(2)

  linkService.create({
    long_url: 'http://www.siloz.io/5'
  }, function (e, link) {
    linkService.find({
      short_url: '123'
    }, function (err, res) {
      t.ok(err, 'should throw not found error')
    })
  })

  linkService.create({
    long_url: 'http://www.siloz.io/5'
  }, function (e, link) {
    linkService.find({
      short_url: link.short_url
    }, function (e, res) {
      t.equal(res.long_url, 'http://www.siloz.io/5', 'should find link')
    })
  })
})
