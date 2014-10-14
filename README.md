[![build status](https://travis-ci.org/taterbase/oplog-transform-tail.svg)](https://travis-ci.org/taterbase/oplog-transform-tail)
#Oplog Transform Tail
*Tail the MongoDB oplog and update a secondary store in real time*

##About

This is just a combination of [oplog-transform](https://npm.im/oplog-transform) and [mongo-oplog](https://npm.im/mongo-oplog) to make a seemless tool for tailing the MongoDB oplog and performing the changes on a secondary store.

##Usage
```javascript
var tail = require('oplog-transform-tail')
  
tail({
  url: "mongodb://127.0.0.1:27017/local", //optional

  //Function to call when an insert occurs
  insert: function(_id, doc, cb) {
    /* insert doc */
    cb()
  },
    
  //Function to call when an update occurs
  update: function(_id, done){
    var retrievedDoc = /* fetch doc from your secondary store */
    done(retrievedDoc, function(err, updatedDoc, cb) {
      /* store updated doc */
      cb()
    })
  },

  //Function to call when an delete occurs
  remove: function(_id, cb) {
    /* delete doc */
    cb()
  }
})

```

See the [oplog-transform docs](https://github.com/taterbase/oplog-transform#hooks) for more in-depth info about how the `insert`, `update`, and `remove` hooks work.
