var mongo = require('mongodb')
var config = require('./coffee_config')
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server(config.database.ip, config.database.port, { auto_reconnect: true});
db = new Db(config.database.name, server, {safe:false}); // TODO: Write Concern
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to '"+config.database.name+"' database");
    }
});


/*
 * GET users listing.
 */

exports.index = function(req, res){
	res.send("respond with a resource");
};
 
// Tenk at en linjeforening == en coll(ection)
exports.coll = {
	"index": function(req, res){
		res.header("Content-Type", "text/html; charset=utf-8");
		res.render("collection_index", {title: req.params.collection});
	},
	"all": function(req, res){
		res.header("Content-Type", "application/json; charset=utf-8");
		
		console.log("Getting all pots from "+req.params.collection.toUpperCase());
		db.collection(req.params.collection.toLowerCase(), function(err, collection) {
			collection.find().toArray(function(err, items) {
				output = '{'
					+ '"count" : ' + items.length + ','
					+ '"pots" : ' + JSON.stringify(items) 
					+ '}';

				res.setHeader("Content-Type", "application/json");
				res.end(output);
			});
		});
	},
};
 
 
