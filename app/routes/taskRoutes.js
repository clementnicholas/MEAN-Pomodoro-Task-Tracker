var users = require('../controllers/usersCtrl');
var tasks = require('../controllers/tasksCtrl');

module.exports = function(app) {
  app.route('/api/tasks')
    .get(users.requiresLogin, tasks.list)
    .post(users.requiresLogin, tasks.create);

  app.route('/api/tasks/:taskId')
    .put(users.requiresLogin, tasks.update)
    .delete(users.requiresLogin, tasks.delete);    

  app.param('taskId', tasks.taskByID);
}