var users = require('../controllers/usersCtrl.js');
var passport = require('passport');

module.exports = function(app) {
  app.get('/logout', users.logout);

  app.get('/auth/facebook', passport.authenticate('facebook', {
    failureRedirect: '/',
    scope: 'email'
  }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect : '/'
  }));

  app.get('/connect/facebook', passport.authorize('facebook', { 
    failureRedirect: '/',
    scope : 'email' 
  }));

  app.get('/connect/facebook/callback', passport.authorize('facebook', {
    successRedirect : '/',
    failureRedirect : '/'
  }));

// TODO: Code is here for the server-side, not implemented in the client.
  app.get('/unlink/facebook', function(req, res) {
    var user = req.user;
    user.facebook.token = undefined;
    user.save(function(err) {
      res.redirect('/');
    });
  });

  app.get('/auth/google', passport.authenticate('google', { 
    scope : ['', 'email'],
    failureRedirect : '/' 
  }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/'
  }));

  app.get('/connect/google', passport.authorize('google', { 
    scope : ['profile', 'email'],
    failureRedirect : '/' 
  }));

  app.get('/connect/google/callback', passport.authorize('google', {
    successRedirect : '/',
    failureRedirect : '/'
  }));

// TODO: Code is here for the server-side, not implemented in the client.
  app.get('/unlink/google', function(req, res) {
    var user = req.user;
    user.google.token = undefined;
    user.save(function(err) {
      res.redirect('/');
    });
  });
}
