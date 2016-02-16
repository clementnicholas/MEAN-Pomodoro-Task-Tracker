var mongoose = require('mongoose');
var Task = require('../models/task');

var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        return err.errors[errName].message;
      }
    }
  } else {
    return 'Unknown server error.';
  }
}

exports.list = function(req, res) {
  Task.find().sort('deadline').populate('creator', 'facebook.name google.name').exec(function(err, tasks) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(tasks);
    }
  });
}

exports.create = function(req, res) {
  var task = new Task(req.body);
  console.log(task);
  task.creator = req.user;
  console.log(task);
  task.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  });
}

exports.taskByID = function(req, res, next, id) {
  Task.findById(id).populate('creator', 'facebook.name google.name').exec(function(err, task) {
    if (err) {
      return next(err);
    }
    if (!task) {
      return next(new Error('No task with Id: ' + id));
    }

    req.task = task;
    next();
  });
}

exports.update = function(req, res) {
  var task = req.task;
  task.title = req.body.title;
  task.desc = req.body.desc;
  task.completed = req.body.completed;
  task.deadline = req.body.deadline;
  task.pomodoroCount = req.body.pomodoroCount;

  task.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  });
}

exports.delete = function(req, res) {
  var task = req.task;
  task.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  });
}