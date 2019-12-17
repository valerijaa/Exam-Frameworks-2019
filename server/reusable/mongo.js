const mongo = require('mongodb');

var url = process.env.DB_CONNECTION_STRING || "mongodb://admin:secret@localhost:27017";
var db = null;

module.exports = {};
module.exports.ensureIsConnected = function(callback) {
    if (db == null) {
        mongo.connect(url,{ useNewUrlParser: true }, function(err, client) {
            db = client.db(process.env.DB_NAME || "exam");
            console.log("MongoDB connected");
            callback();
        });
    }
    else {
        callback();
    }
};
module.exports.getCollection = function(collectionName){
    return db.collection(collectionName);
};