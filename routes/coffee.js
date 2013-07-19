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

var getOldFormatFromDate = function(date) {
	var monthNames = [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ];
		
	var txt = date.getDate() + ". "
		+ monthNames[date.getMonth()] + " "
		+ date.getFullYear() + " "
		+ ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" 
		+ ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes() + ":" 
		+ ((date.getSeconds() < 10) ? "0" : "") + date.getSeconds();
	return txt;
}


/*
 * GET users listing.
 */

exports.index = function(req, res){
	res.send("respond with a resource");
};
 
// Tenk at en linjeforening == en coll(ection)
exports.coll = {
	"index": function(req, res){
		res.setHeader("Content-type", "text/html; charset=utf-8");
		
		console.log( res.render("collection_index", {title: req.params.collection}) );
		res.render("collection_index", {title: req.params.collection}, function(value) { 
			console.log(res);
		});
	},
	"all": function(req, res){
		res.setHeader("Content-Type", "application/json; charset=utf-8");
		
		console.log("Getting all pots from "+req.params.collection.toUpperCase());
		db.collection(req.params.collection.toLowerCase(), function(err, collection) {
			collection.find().toArray(function(err, items) {
				output = '{'
					+ '"count" : ' + items.length + ','
					+ '"pots" : ' + JSON.stringify(items) 
					+ '}';

				res.end(output);
			});
		});
	},
	"latest":function(req, res) {
		res.setHeader("Content-Type", "application/json; charset=utf-8");
		
		console.log("Getting freshest pot from "+req.params.collection.toUpperCase());
		db.collection(req.params.collection.toLowerCase(), function(err, collection) {
			/* Ugly hack while waiting for native MongoDB.collection.MAX(field) */
			collection.find().sort({"date":-1}).limit(1).toArray(function(err, item) {
				output = '{'
					+ '"count" : ' + item.length + ','
					+ '"pots" : ' + JSON.stringify(item) 
					+ '}';

				res.end(output);
			});
		});
	},
	"latest_txt":function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		
		console.log("Getting freshest pot from "+req.params.collection.toUpperCase());
		db.collection(req.params.collection.toLowerCase(), function(err, collection) {
		
			/* Ugly hack while waiting for native MongoDB.collection.MAX(field) */
			collection.find().sort({"date":-1}).limit(1).toArray(function(err, items) {
				try {
					var item = items[0];
					console.log(item);	
					var output = item.numberThisDay + "\n" 
							+ getOldFormatFromDate(item.date);
	
					res.end(output);
				} catch(err) {
					throw err;
				}
			});
		});
	},
	"since":function(req, res) {
		// TODO: Implementere
		res.status(501);
		res.end();
	},
	
};
 
 
