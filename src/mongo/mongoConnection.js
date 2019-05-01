var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017'
var dbname = 'mydb'
var db


function connect(callback) {
    console.log("Tratando de conectar")
    MongoClient.connect(url, { useNewUrlParser: true } , function(err, _db) {
        if (err) throw err
        console.log("Mongo DB Connected")
        db=_db.db(dbname)
        callback(db)        
    })
}

function close() {
    db.close()
}

exports.connect = connect;
exports.close = close;
exports.url = url

