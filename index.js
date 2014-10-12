var Readable = require('stream').Readable
  , Transform = require('oplog-transform')
  , MongoOplog = require('mongo-oplog')

module.exports = oplogTransformTail

function oplogTransformTail(options) {
  var uri = options.uri

  options.objectMode = true
  delete options.uri

  var oplog     = MongoOplog(uri).tail()
    , transform = new Transform(options)

  oplog.on('op', function(doc) {
    transform.write(doc)
  })

}
