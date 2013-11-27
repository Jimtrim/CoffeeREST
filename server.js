/*global require, process, __dirname, console */

var express = require('express'), 
  routes = require('./routes'), 
  coffee = require('./routes/coffee'), 
  http = require('http'), 
  path = require('path'), 
  config = require('./config'),
  db = require('mongodb');

var app = express();
 

// all environments
// app.set('env', 'development');
app.set('port', process.env.PORT || config.server.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(express.bodyParser());


app.get('/', routes.index);
app.get('/coffee', coffee.index);
app.get('/coffee/:collection', coffee.rest.index);
app.get('/coffee/:collection/all', coffee.rest.getAllPots);
app.get('/coffee/:collection/latest', coffee.rest.getLatestPotJSON);
app.get('/coffee/:collection/latest.txt', coffee.rest.getLatestPotTXT);
app.get('/coffee/:collection/since/:timestamp', coffee.rest.sinceUNIX);
app.get('/coffee/:collection/since/:year/:month/:day', coffee.rest.since);


app.post('/coffee/:collection/add', coffee.rest.addPot);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
