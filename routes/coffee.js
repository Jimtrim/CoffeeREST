/*global require, console, exports*/

var mongo = require('mongodb');
var config = require('../config');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server(config.database.ip, config.database.port, { auto_reconnect: true});
var db = new Db(config.database.name, server, {safe:false}); // TODO: Write Concern
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to '"+config.database.name+"' database");
    }
});


/**
 * Formatting methods
 **/



/**
 * API-methods
 **/
var coffeeAPI = {};

coffeeAPI.util = {
    /* helper: convert JSON pot to old TXT-format */
    "getOldFormatFromDate": function(date) {
        var monthNames =  [ "January", "February", "March", "April", "May", "June", "July", "August", 
                   "September", "October", "November", "December" ];
            
        var txt = date.getDate() + ". " + 
            monthNames[date.getMonth()] + " " +
            date.getFullYear() + " " +
            ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + 
            ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes() + ":" +  
            ((date.getSeconds() < 10) ? "0" : "") + date.getSeconds();
        return txt;
    }, 
    
    // format JSON-coffee in one way, no matter how many or few
    "potsToJSON": function(collectionName, pots) {
        
        var count = pots.length || (pots.date ? 1 : 0);
        
        return '{' +
                '"unit" : "' + collectionName + '" ,' +
                '"count" : ' + count + ',' +
                '"pots" : ' + JSON.stringify(pots) +
        '}';
    },
    
};

coffeeAPI.db = {
    
    /* Returns the latest element in a given collection */
    "getLatestPot": function(collectionName, callback) {
		console.log("Getting freshest pot from "+collectionName.toUpperCase());
        
		db.collection(collectionName.toLowerCase(), function(err, collection) {
			/* Ugly hack while waiting for native MongoDB.collection.MAX(field) */
			collection.find().sort({"date":-1}).limit(1).toArray(function(err, pots) {
                
                var pot = (pots.length > 0 ? pots[0] : undefined ) ;
                
                if (typeof callback === "function") {
                    callback(err, pot);
                }
			});
		});
    },
    
    /* Returns a list of all pots from given collection */
    "getAllPots": function(collectionName, callback){
		console.log("Getting all pots from "+collectionName.toUpperCase());
        
		db.collection(collectionName.toLowerCase(), function(err, collection) {
			collection.find().sort({"date":-1}).toArray(function(err, pots) {
                 if (typeof callback === "function") {
                    callback(err, pots);
                }
			});
		});
	},
    
    "getAllPotsSinceUNIX": function(collectionName, date, callback) {
         db.collection(collectionName.toLowerCase(), function(err, collection) {
			collection.find({"date": {$gt : date}})
                    .sort({"date":-1})
                    .toArray(function(err, pots) {
                if (typeof callback === "function") {
                    callback(err, pots);
                }
			});
            
		});
    },
    
    "addNewPot": function (collectionName, date, callback) {
        db.collection(collectionName.toLowerCase(), function(err, collection) {
            coffeeAPI.db.getLatestPot(collectionName.toLowerCase(), function(err, last_pot) {
                var newNumberThisDay = last_pot.numberThisDay || 0;
                newNumberThisDay += 1;
                
                collection.insert({"numberThisDay" : newNumberThisDay+1, "date" : date.toJSON()}, function(err, results, next){
                    callback();
                });
            });
        });
    }
    
};


/**
 * HTTP-methods
 **/

/* GET Coffee index (should list active collections)*/
exports.index = function(req, res){
	res.send("<h1>It works!</h1> <p>Welcome to CoffeREst</p>");
};


// Tenk at en linjeforening == en coll(ection)
exports.rest = {
    /* GET unit index */
	"index": function(req, res){
		res.setHeader("Content-type", "text/html; charset=utf-8");
		res.render("collection_index", {unit: req.params.collection});
        res.end();
	},
    
    /* GET all pots from given unit */
	"getAllPots": function(req, res){  
        coffeeAPI.db.getAllPots(req.params.collection, function(err, pots) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end( coffeeAPI.util.potsToJSON(req.params.collection, pots) );
        });
	},
    
    /* GET latest pot from given unit */
	"getLatestPotJSON":function(req, res) {
        coffeeAPI.db.getLatestPot(req.params.collection, function(err, pot) {
            pot = pot || {}; // fix for undefined units
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end( coffeeAPI.util.potsToJSON(req.params.collection, pot) );
        });
	},
    
    /* GET latest pot from given unit as a .txt-file */
	"getLatestPotTXT":function(req, res) {
        coffeeAPI.db.getLatestPot(req.params.collection, function(err, pot) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            
            if (pot) {
                var output = pot.numberThisDay + "\n" + coffeeAPI.util.getOldFormatFromDate(pot.date);
                res.status(200);
                res.end(output);
            } else {
                res.status(204);
                res.end("No pots found for: "+req.params.collection);
            }
        });
	},
    
    "since": function(req, res) {
        var year = parseInt(req.params.year, 10);
        var month = parseInt(req.params.month, 10);
        var day = parseInt(req.params.day, 10);
        
        // TODO: fix sloppyness
        if(year>1970 && 0 <= month && month <= 12 && 0 <= day && day <=31 ) {
            var date = new Date(year, month-1, day);
            coffeeAPI.db.getAllPotsSinceUNIX(req.params.collection, date, function(err, pots) {
                res.status(200);
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end( coffeeAPI.util.potsToJSON(req.params.collection, pots) );
            });
        } else {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.status(400);
            res.end("Invalid date: "+req.params.year+"/"+req.params.month+"/"+req.params.day+".");
        }
    },
    
    
    /* GET all pots newer than a given timestamp */
	"sinceUNIX":function(req, res) {
        // God test-timestamp: 1379509200 (18. Sept 2013, 13:00:00)
        var date = new Date(req.params.timestamp*1000); // sec2ms
		
        coffeeAPI.db.getAllPotsSinceUNIX(req.params.collection, date, function(err, pots) {
            res.status(200);
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end( coffeeAPI.util.potsToJSON(req.params.collection, pots) );
        });
	},
    
    
    /* POST */
    "addPot" : function(req, res, next) {
        var data = "";
        
        req.addListener("data", function(chunk) {
            if (chunk) data += chunk;
        });
     
        req.addListener("end", function() {
            var json_data = JSON.parse("{}");
            try {
                json_data = JSON.parse(data);
            } catch (e) {
                res.status(400);
                res.end("Invalid input, should be in the form: \"{\"collection\": \"<UNION>\"} \"");
            }
            
            console.log("BOOLEAN: "+ (req.params.collection.toLowerCase() == json_data.collection.toLowerCase()) );
            if ( req.params.collection.toLowerCase() == json_data.collection.toLowerCase() ) {
                // TODO: add support for specifying date to insert
                
                var date = new Date();
                
                coffeeAPI.db.addNewPot(req.params.collection, date, function() {
                    res.status(201);
                    res.end(data);
                });
                
            } else {
                res.status(500);
                res.end("CoffeREST-error, find a codemonkey to fix!");
            }
        });
    }, 
};
 
 
