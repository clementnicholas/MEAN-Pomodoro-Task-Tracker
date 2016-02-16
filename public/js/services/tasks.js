angular.module('tasks')

  .factory('taskService', ['$resource', function($resource) {

    return $resource('api/tasks/:taskId', {
      taskId: '@_id'
    },  {
      update: {
        method: 'PUT'
      }
    });    
  }]);


