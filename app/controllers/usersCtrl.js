var User = require('../models/user');
var passport = require('passport');

var getErrorMessage = function(err) {
  var message = 'Something went wrong.';
  for (var errName in err.errors) {
    if (err.errors[errName].message) {
      message = err.errors[errName].message;
    }
  }
  return message;
}

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
}

exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }
  next();
}