var port = 4567;

module.exports = {
  port: port,
  db: 'mongodb://localhost:27017/pomodoro',
  facebookAuth: {
    'clientID' : '765052613629038', 
    'clientSecret' : '54d866b02bf5788a99fbdb03c70477f1',
    'callbackURL' : 'http://localhost:4567/auth/facebook/callback'
  },
  googleAuth: {
    'clientID' : '164261624578-m2m29oj7p02fcgroa2vu5ogr2um2fav4.apps.googleusercontent.com',
    'clientSecret' : 'SdOsNupq3lQoGKHhPV1aFFca',
    'callbackURL' : 'http://localhost:4567/auth/google/callback'
  }
}