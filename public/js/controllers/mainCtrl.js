angular.module('tasks', [])

  .controller('mainController', ['$scope', '$routeParams', '$location', 'taskService', 'timerService', 'Authentication', function($scope, $routeParams, $location, taskService, timerService, Authentication) {

    Notification.requestPermission();
// ====================================================================================
// ====================================================================================
// ====================================================================================
// SHOULD PROBABLY MOVE THIS TO SEPARATE TIMER CONTROLLER! ============================
// ====================================================================================
// ====================================================================================
// ====================================================================================
// ====================================================================================
// ====================================================================================
    $scope.service = timerService;
    $scope.timeDisplay = timerService.displayTime();
 
// START TIMER IF IT ISN'T DISABLED.
// WHEN IT STARTS, DISABLE IT.
// IF A TASK IS BEING WORKED ON, ADD TO IT'S POM COUNT AND SAVE IT TO DB.
// REMOVE TASK FROM WORKED ON QUEUE, IT'S NO LONGER ACTIVE.
// LOAD/RELOAD AUDIO
    $scope.start = function() {
      if (!$scope.timerDisabled) {        
        timerService.start();
        $scope.timerDisabled = true;
      }
      if ($scope.isPomodoro && $scope.pomodoroTask) {
        $scope.pomodoroTask.pomodoroCount++;
        $scope.updateTask($scope.pomodoroTask._id);
        $scope.isPomodoro = false;
        $scope.tasks.forEach(function(task) {
          task.active = false;
        });
      }
      document.getElementById('audio').load();
    }

// STOP THE TIMER. ENABLE THE TIMER.
// THERE'S NO TASK TO WORK ON.
// PAUSE AUDIO.
    $scope.stop = function() {
      timerService.stop();
      $scope.timerDisabled = false;
      $scope.isPomodoro = false;
      document.getElementById('audio').pause();
    }

// RESET THE TIMER. ENABLE THE TIMER.
// THERE IS A TASK TO BE WORKED ON (CALLED WHEN CLICKING NEW POM BUTTON)
// PAUSE AUDIO
    $scope.reset = function() {
      timerService.reset();
      $scope.timerDisabled = false;
      $scope.isPomodoro = true;
      document.getElementById('audio').pause();
    }

// SET TIMER TO BREAK TIME DURATION AND ENABLE IT.
// MAKE SURE THERE'S NO TASK TO BE WORKED ON.
// PAUSE AUDIO.
    $scope.takeBreak = function() {
      timerService.takeBreak();
      $scope.timerDisabled = false;
      $scope.isPomodoro = false;
      $scope.tasks.forEach(function(task) {
        task.active = false;
      });
      $scope.clearForm();
      document.getElementById('audio').pause();
    }

// WATCH THE TIME DISPLAY AS IT TICKS (HANDLED WITHIN SERVICE).
// IF IT REACHES ZERO, STOP THE TIMER.
// CREATE A NOTIFICATION OR AN ALERT. PLAY THE AUDIO.    
    $scope.$watch('service.displayTime()', function(newValue) {
      $scope.timeDisplay = newValue;
      if (newValue == '00:00') {
        $scope.stop();
        if (Notification.permission === 'granted') {
          var n = new Notification("Time Expired!", { body: "Great work. Keep it up." , icon: "css/tomato.ico"});
          setTimeout(n.close.bind(n), 6000);
        } else {
          alert("Time's up!");
        }
        document.getElementById('audio').play();
      }
    });


// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// TASK OPERATIONS===========================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================

  // see if a user is logged in
    $scope.authentication = Authentication;
  // controls if the form is for editing or creating.  
    $scope.editing = false;

    $scope.clearForm = function() {
      $scope.title = '';
      $scope.desc = '';
      $scope.deadline = '';
    }

    $scope.getTaskById = function(id) {
      $scope.tasks.forEach(function(obj) {
        if (obj._id === id) {
          $scope.activeTask = obj;
        }
      });
      return $scope.activeTask;
    }

  // used to set a task card to active
    $scope.activateTask = function(id) {
      $scope.tasks.forEach(function(task) {
        task.active = false;
      });
      var task = $scope.getTaskById(id);
      task.active = true;
    }    

  // used to tell us which pom Count to increase
    $scope.setPomodoroTask = function(id) {
      $scope.pomodoroTask = $scope.getTaskById(id);
      $scope.editing = false;
      $scope.activateTask(id);
      $scope.clearForm();
    }

  // gets all the tasks that match a logged in user
    $scope.find = function() {
      var arr = [];
      taskService.query(function(response) {
        response.forEach(function(task) {
          if (task.creator && task.creator._id === user._id) {
            arr.push(task);
          }
        });
        console.log(response);
        console.log(arr);
      });      
      $scope.tasks = arr;
      return arr;
    }

  // first time we get all the tasks of a logged in user.
  // defaults the activated and ready task to the first task in the list.
    $scope.firstFind = function() {
      var arr = [];
      taskService.query(function(response) {
        response.forEach(function(task) {
          if (task.creator && task.creator._id === user._id) {
            arr.push(task);
          }
        });
        $scope.tasks = arr;
        if ($scope.tasks[0] != undefined) {
          $scope.pomodoroTask = $scope.tasks[0];
          $scope.tasks[0].active = true;
        }
        return arr;
      });      
    }

  // initial state
    $scope.initialize = function() {
      if ($scope.authentication.user) {
        var tasks = $scope.firstFind();
        $scope.editing = false;
        $scope.isPomodoro = true;
        $scope.timerDisabled = false;
      }
    }

    $scope.initialize();

    $scope.createTask = function() {
      var task = new taskService ({
        title : this.title,
        desc : this.desc,
        deadline : this.deadline
      });

      task.$save(function(response) {
        $scope.find();
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      $scope.clearForm();
    }

  // preps form for edit with task info
    $scope.populateForm = function(id) {
      $scope.editing = true;
      var task = $scope.getTaskById(id);
      $scope.activateTask(id);
      $scope.title = task.title;
      $scope.desc = task.desc;
      $scope.deadline = task.deadline;
      $scope._id = id;
    }

  // if scope.editing, it's updating through the form.
  // other updates can be called by increasing the pom count or toggling completion
    $scope.updateTask = function(id) {

      if ($scope.editing) {
        $scope.task = $scope.getTaskById($scope._id);
        $scope.task.title = $scope.title;
        $scope.task.desc = $scope.desc;
        $scope.task.deadline = $scope.deadline;
      } else {
        $scope.task = $scope.getTaskById(id);
      }

      $scope.task.$update(function() {
        $scope.editing = false;
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      $scope.clearForm();
    }

    $scope.deleteTask = function(id) {
      var task = $scope.getTaskById(id);
      if (task) {
        task.$remove(function() {
          for (var i in $scope.tasks) {
            if ($scope.tasks[i] === task) {
              $scope.tasks.splice(i, 1);
            }
          }
        });
      } else {
        $scope.task.$remove(function() {
          $location.path('tasks');
        });
      }
    }

    $("#datetimepicker").datetimepicker().on("dp.change", function(e) {
      $scope.deadline = $("#deadlinepicker").val();
    });

  }]);