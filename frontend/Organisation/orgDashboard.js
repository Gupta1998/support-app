app.controller(
  "Org",
  function ($scope, $http, AuthService, $state, StorageService) {
    const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
    $http({
      method: "GET",
      url: "http://localhost:3000/users/" + loggedInUser.id,
    })
      .then(function (response) {
        $scope.users = response.data.users;
      })
      .catch(function (error) {
        console.log(error);
      });

    $scope.edit = function (org) {
      const id = org._id;
      StorageService.set(id);
      $state.go("updateUser");
    };
    $scope.delete = function (id) {
      $http({
        method: "DELETE",
        url: `http://localhost:3000/org/${id}`,
      })
        .then(function (response) {
          if (response.success) {
            console.log("Deleted successfully");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    $scope.logout = function () {
      AuthService.logout();
      $state.go("login");
    };
  }
);
