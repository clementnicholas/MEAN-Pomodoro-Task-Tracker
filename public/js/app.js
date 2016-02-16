angular.module('pomodoroToDo', ['ngResource', 'ngRoute', 'tasks', 'users', 'timer'])

  .config(['$locationProvider', function($locationProvider) {

    $locationProvider.hashPrefix('!');
  
  }]);

  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }
