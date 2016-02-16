angular.module('tasks')

  .config(['$routeProvider', function($routeProvider) {

    $routeProvider

    .when('/', {
      templateUrl: '/views/index.html',
      controller: 'mainController'
    })

    .otherwise({ redirectTo: '/' });
  }]);