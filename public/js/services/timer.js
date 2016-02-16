angular.module('timer', [])

  .service('timerService', function($rootScope) {
    var timer = 60 * 25;
    var ticker;

    var countdown = function() {
      timer = timer - 1;
      $rootScope.$apply();
    }

    this.start = function() {
      if (timer > 0) {
        ticker = setInterval(countdown, 1000);
      }
    }

    this.stop = function() {
      clearInterval(ticker);      
    }

    this.reset = function() {
      clearInterval(ticker);
      timer = 25 * 60;
    }

    this.takeBreak = function() {
      clearInterval(ticker);
      timer = 5 * 60;
    }

    this.displayTime = function() {
      var minutes = Math.floor(timer / 60);
      var seconds = timer % 60;
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      return minutes + ':' + seconds;
    }
  });