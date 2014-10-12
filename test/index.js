var db
  , store = {}
  , MongoClient = require('mongodb').MongoClient
  , flatten = require('lodash.flatten')
  , async = require('async')
  , should = require('should')
  , tail = require('../index')
  
tail({
  url: "mongodb://127.0.0.1:27017/local",

  insert: function(_id, doc, cb) {
    store[_id] = doc
    cb()
  },

  update: function(_id, done){
    done(store[_id], function(err, updatedDoc, cb) {
      store[_id] = updatedDoc
      cb()
    })
  },

  remove: function(_id, cb) {
    delete store[_id]
    cb()
  }
})

describe('oplog-transform-tail', function() {
  before(function(done) {
    MongoClient.connect("mongodb://127.0.0.1:27017/oplog-transform-tail-test", function(err, connection) {
      if (err)
        return done(err)

      db = connection.collection('test')
      db.remove(done) //Empty it out
    })
  })

  it('should work', function(done) {
    async.series([
      function(cb) {
        db.insert({well: {hey: "there"}}, cb)
      },

      function(cb) {
        db.insert({to: {be: "removed"}}, cb)
      },

      function(cb) {
        db.update({"well.hey": "there"}, {$set: {friends: "the best"}}, cb)
      },

      function(cb) {
        db.remove({"to.be": "removed"}, cb)
      }
    ], function(err, docs) {
      if (err)
        return done(err)

      setTimeout(function() {
        docs = flatten(docs)

        should.exist(store[docs[0]._id])
        should.not.exist(store[docs[1]._id])

        store[docs[0]._id].well.hey.should.eql('there')
        store[docs[0]._id].friends.should.eql('the best')

        done()
      }, 1000)
    })
  })

})
