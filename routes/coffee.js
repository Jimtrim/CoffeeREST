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
    
    "monthNames": [ "January", "February", "March", "April", "May", "June", "July", "August", 
                   "September", "October", "November", "December" ],
    
    "getOldFormatFromDate": function(date) {
            
        var txt = date.getDate() + ". " + 
            coffeeAPI.util.monthNames[date.getMonth()] + " " +
            date.getFullYear() + " " +
            ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + 
            ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes() + ":" +  
            ((date.getSeconds() < 10) ? "0" : "") + date.getSeconds();
        return txt;
    }, 
    
    "potsToJSON": function(collectionName, pots) {
        return '{' +
                '"unit" : ' + collectionName + ', ' +
                '"count" : ' + pots.length + ',' +
                '"pots" : ' + JSON.stringify(pots) +
        '}';
    },
    
};

coffeeAPI.db = {
    /* Helper for getting latest pot from a collection, regardless of format*/
    // TODO: create error-handling for undefined callback.
    
    /**
     * getLatestPot(String collectionName, function(err, pots) {...} );
     *
     * Input-function should format a HTTP-response
     * Returns a array with 0 or 1 element.
     */
    "getLatestPot": function(collectionName, callback) {
		console.log("Getting freshest pot from "+collectionName.toUpperCase());
        
		db.collection(collectionName.toLowerCase(), function(err, collection) {
			/* Ugly hack while waiting for native MongoDB.collection.MAX(field) */
			collection.find().sort({"date":-1}).limit(1).toArray(function(err, pot) {
                if (typeof callback === "function") {
                    callback(err, pot);
                }
			});
		});
    },
    
    /**
     * getLatestPot(String collectionName, function(err, pots) {...} ;
     *
     * input-function should format a HTTP-response
     * returns array with 0 to infinite(ish) elements
     */
    "getAllPots": function(collectionName, callback){
		console.log("Getting all pots from "+collectionName.toUpperCase());
        
		db.collection(collectionName.toLowerCase(), function(err, collection) {
			collection.find().toArray(function(err, pots) {
                 if (typeof callback === "function") {
                    callback(err, pots);
                }
			});
		});
	},
    
};


/**
 * HTTP-methods
 **/

/* GET users listing. */
var output;

/* GET Coffee index (should list active collections)*/
exports.index = function(req, res){
	res.send("<h1>It works!</h1> <p>Welcome to CoffeREst</p>");
};


// Tenk at en linjeforening == en coll(ection)
exports.coll = {
    /* GET unit index */
	"index": function(req, res){
		res.setHeader("Content-type", "text/html; charset=utf-8");
		res.render("collection_index", {title: req.params.collection});
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
        coffeeAPI.db.getLatestPot(req.params.collection, function(err, pots) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end( coffeeAPI.util.potsToJSON(req.params.collection, pots) );
        });
	},
    
    /* GET latest pot from given unit as a .txt-file */
	"getLatestPotTXT":function(req, res) {
        coffeeAPI.db.getLatestPot(req.params.collection, function(err, item) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            
            if (item.length > 0) {
                var output = item[0].numberThisDay + "\n" + coffeeAPI.util.getOldFormatFromDate(item[0].date);
                res.end(output);
            } else {
                res.status(404);
                res.end("no pots found for: "+req.params.collection);
            }
        });
	},
    
    /* GET all pots newer than a given timestamp */
	"since":function(req, res) {
		// TODO: Implementere
		res.status(501);
		res.end(); 
	},
    
    /* POST */
    "addPot":function(req, res, next) {
        // TODO: add auth
        db.collection(req.params.collection.toLowerCase(), function(err, collection) {
            
            
            collection.insert({"date":new Date().toJSON()}, function(e, results, next){
                if (e) 
                    return next(e);
                res.status(201);
                res.end(results);
            });
        });
    }, 
};
 
 
