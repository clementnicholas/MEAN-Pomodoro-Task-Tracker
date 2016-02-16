var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Task', {
  title : { 
    type : String, 
    trim: true, 
    required: 'Must enter a title' 
  },
  desc : { 
    type: String, 
    default: '', 
    trim: true 
  },
  deadline : Date,
  pomodoroCount : { 
    type: Number, 
    default: 0 
  },
  creator : { 
    type: Schema.ObjectId, 
    ref: 'User' 
  },
  completed : { 
    type: Boolean, 
    default: false 
  }
});