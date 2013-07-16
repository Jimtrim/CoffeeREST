
/*
 * GET users listing.
 */

exports.index = function(req, res){
	res.send("respond with a resource");
};
 
exports.online = {
	"index": function(req, res){
		res.send("ONLINE: Index page");
	},
	"all": function(req, res){
		res.send("ONLINE: All pots page");
	},
};
 
 
