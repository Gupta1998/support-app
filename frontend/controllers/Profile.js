// app.directive("fileModel", [
//   "$parse",
//   function ($parse) {
//     return {
//       restrict: "A",
//       link: function (scope, element, attrs) {
//         var model = $parse(attrs.fileModel);
//         var modelSetter = model.assign;

//         element.bind("change", function () {
//           scope.$apply(function () {
//             modelSetter(scope, element[0].files[0]);
//           });
//         });
//       },
//     };
//   },
// ]);

app.controller("Profile", [
  "$scope",
  "$stateParams",
  "$http",
  function ($scope, $stateParams, $http) {
    $scope.loggedInUserId = $stateParams.id;

    $scope.updateUser = function () {
      var fd = new FormData();
      var file = $scope.myFile;
      // fd.append("firstName", $scope.firstName);
      // fd.append("lastName", $scope.lastName);
      // fd.append("password", $scope.confirmPassword);
      // fd.append("mobileNo", $scope.mobileNumber);
      angular.forEach($scope.updateProfile, function (value, key) {
        if (key[0] == "$") return;
        if (!value.$pristine) {
          fd.append(key, value.$modelValue);
        }
      });

      // $scope.SelectFile = function (e) {
      //   console.log(e.target.files[0].name);
      // };
      if (angular.element("#file")[0].files.length === 0)
        fd.append("avatar", file);
      else {
        fd.append("avatar", "No File Selected.");
      }

      $http
        .put("http://localhost:3000/avatar/" + $stateParams.id, fd, {
          transformRequest: angular.identity,
          headers: { "Content-Type": undefined },
        })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (err) {
          console.log(err);
        });

      $scope.firstName = "";
      $scope.lastName = "";
      $scope.confirmPassword = "";
      $scope.mobileNumber = "";
    };
  },
]);
