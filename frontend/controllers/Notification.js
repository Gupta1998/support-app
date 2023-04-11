app.controller(
  "NotificationController",
  function ($scope, $rootScope, NotificationService) {
    $scope.notifications = [];
    $rootScope.loggedInUser = JSON.parse(localStorage.getItem("userDetails"));

    // Emit the 'join' event to the server
    NotificationService.emit("join", $rootScope.loggedInUser.id);

    // get user's notifications
    NotificationService.getNotifications($rootScope.loggedInUser.id).then(
      function (response) {
        $scope.notifications = response.data;
        console.log($scope.notifications);
      }
    );

    NotificationService.on("notification", function (notification) {
      console.log(notification);
      $scope.$apply(function () {
        $scope.notifications.push(notification);
      });
    });

    // send notification
    $scope.sendNotification = function () {
      const notification = {
        from: {
          _id: $rootScope.loggedInUser.id,
          username: $rootScope.loggedInUser.username,
          role: $rootScope.loggedInUser.role,
        },
        to: { _id: $scope.toUser },
        message: $scope.message,
      };
      NotificationService.emit("notification", notification);
      NotificationService.sendNotification(notification).then(function (
        response
      ) {
        console.log(response.data);
        // $scope.notifications.push(response.data);
        // $scope.recipientId = "";
        // $scope.message = "";
      });
    };

    // Mark a notification as read
    $scope.markAsRead = function (notificationId) {
      $http.put("/api/notifications/" + notificationId).then(
        function (response) {
          console.log(response.data);
        },
        function (error) {
          console.error(error);
        }
      );
    };
  }
);
