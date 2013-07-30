var express = require('express')
  , routes = require('./routes')
  , coffee = require('./routes/coffee')
  , http = require('http')
  , path = require('path')
  , config = require('./config');

var app = express();
 

// all environments
// app.set('env', 'development');
app.set('port', process.env.PORT || config.server.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/coffee', coffee.index);
app.get('/coffee/:collection', coffee.coll.index);
app.get('/coffee/:collection/all', coffee.coll.all);
app.get('/coffee/:collection/latest', coffee.coll.latest);
app.get('/coffee/:collection/latest.txt', coffee.coll.latest_txt);
app.get('/coffee/:collection/:timestamp', coffee.coll.since);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
