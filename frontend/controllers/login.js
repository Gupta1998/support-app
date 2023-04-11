app.controller(
  "Login",
  function ($scope, AuthService, $state, StorageService, ToastNotifications) {
    ToastNotifications.setOptions();
    $scope.login = function () {
      AuthService.login($scope.username, $scope.password)
        .then(function (response) {
          if (response.data.success) {
            ToastNotifications.success("Logged In!");
            AuthService.setLocalStorage(response.data);
            const loggedInUser = JSON.parse(
              localStorage.getItem("userDetails")
            );
            StorageService.set(loggedInUser);
            if (AuthService.isLoggedIn() && loggedInUser.role === "SuperAdmin")
              $state.go("superAdmin_dashboard");
            else if (
              AuthService.isLoggedIn() &&
              loggedInUser.role === "Agent"
            ) {
              $state.go("user_dashboard");
            } else if (
              AuthService.isLoggedIn() &&
              loggedInUser.role === "Admin"
            ) {
              $state.go("admin_dashboard");
            } else {
              $state.go("login");
            }
          } else {
            ToastNotifications.error("Invalid username or password!");
          }
        })
        .catch(function (error) {
          console.log(error);
          $state.go("login");
        });
    };
  }
);
