var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

  facebook : {
    id : String,
    token : String,
    email : String,
    name : String
  },
  google : {
    id : String,
    token : String,
    email : String,
    name : String
  },
  tasks : {}
});

module.exports = mongoose.model('User', userSchema);