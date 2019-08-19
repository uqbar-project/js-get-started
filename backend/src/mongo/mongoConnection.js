var MongoClient = require('mongodb').MongoClient;

const HOST = process.env.MONGO_HOST || 'localhost'
const PORT = process.env.MONGO_PORT || 27017
var url = `mongodb://${HOST}:${PORT}`
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
