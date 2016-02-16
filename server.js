process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config');
var db = require('./config/mongoose');
var express = require('./config/express');
var passport = require('./config/passport');

db = db();
var app = express();
var passport = passport();

// START LISTENING WITH NODE SERVER.JS
app.listen(config.port);

console.log('server running on port ' + config.port);

module.exports = app;

console.log(process.env.NODE_ENV + 'server running');
