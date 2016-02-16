var passport = require('passport');
var mongoose = require('mongoose');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../app/models/user');
var config = require('./env/' + process.env.NODE_ENV + '.js');



module.exports = function() {
  
  // SERIALIZING USERS FOR SESSIONS ============================================
  // ===========================================================================
  // ===========================================================================
  // ===========================================================================
  // ===========================================================================
  // ===========================================================================

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // FACEBOOK ==================================================================
  // ===========================================================================
  // ===========================================================================

  passport.use(new FacebookStrategy({
    clientID : config.facebookAuth.clientID,
    clientSecret : config.facebookAuth.clientSecret,
    callbackURL : config.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'displayName', 'name', 'verified'],
    passReqToCallback : true
  }, 
  function(req, token, refreshToken, profile, done) {

    process.nextTick(function() {

      // If no user in the request, try and find one by the id.
      if (!req.user) {

        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            // If you find one without a facebook token, assign that user a token and profile and safe the user.
            // This may occur if someone disconnects their account.
            if (!user.facebook.token) {
              user.facebook.token = token;
              user.facebook.name = profile.displayName;
              user.facebook.email = profile.emails[0].value;

              user.save(function(err) {
                if (err) {
                  throw err;
                }
                return done(null, user);
              });
            }
            // If you find one with a token, that's your user.
            return done(null, user);
          } else {
            // otherwise, create a new user.
            var newUser = new User();

            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = profile.displayName;
            newUser.facebook.email = profile.emails[0].value;

            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      } else {

      // if there's a user in the request, that's your user. save the users facebook login info. 
        var user = req.user;

        user.facebook.id = profile.id;
        user.facebook.token = token;
        user.facebook.name = profile.displayName;
        user.facebook.email = profile.emails[0].value;

        user.save(function(err) {
          if (err) {
            throw err;
          }
          console.log(user);
          return done(null, user);
        });
      }
    });
  }));

  // GOOGLE ====================================================================
  // ===========================================================================
  // ===========================================================================

  passport.use(new GoogleStrategy({
    clientID : config.googleAuth.clientID,
    clientSecret : config.googleAuth.clientSecret,
    callbackURL : config.googleAuth.callbackURL, 
    passReqToCallback : true
  },
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      //if there's no user with the request, find one by the google ID
      if (!req.user) {
        User.findOne({ 'google.id' : profile.id }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {

            //if you find one without a token (disconnected account), reconnect it with a token and save.
            if(!user.google.token) {
              user.google.token = token;
              user.google.name = profile.displayName;
              user.google.email = profile.emails[0].value;

              user.save(function(err) {
                if (err) {
                  throw err;
                }
                return done(null, user);
              });
            }

            //if it's got a token, that's your user.
            return done(null, user);
          } else {

            //if there's no user with that google.id, create a new user with the google.id/profile
            console.log(profile);
            var newUser = new User();

            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;

            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      } else {
        // if there is a user with your request, update/save that user and send it back.

        var user = req.user;

        user.google.id = profile.id;
        user.google.token = token;
        user.google.name = profile.displayName;
        user.google.email = profile.emails[0].value;

        user.save(function(err) {
          if (err) {
            throw err;
          }
          return done(null, user);
        });
      }
    });
  }));

}