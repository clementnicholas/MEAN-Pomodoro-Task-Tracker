var port = 5050;

module.exports = {
  port: port,
  db: 'mongodb://NewUser:NewPwd@ec2-52-36-102-61.us-west-2.compute.amazonaws.com:27017/dummyDB',
  facebookAuth: {
    'clientID' : '765052613629038', 
    'clientSecret' : '54d866b02bf5788a99fbdb03c70477f1',
    'callbackURL' : 'http://ec2-52-36-102-61.us-west-2.compute.amazonaws.com:5050/auth/facebook/callback'
  },
  googleAuth: {
    'clientID' : '164261624578-m2m29oj7p02fcgroa2vu5ogr2um2fav4.apps.googleusercontent.com',
    'clientSecret' : 'SdOsNupq3lQoGKHhPV1aFFca',
    'callbackURL' : 'http://ec2-52-36-102-61.us-west-2.compute.amazonaws.com:5050/auth/google/callback'
  }
}