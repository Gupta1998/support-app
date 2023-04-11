const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
const mobileRegex = /^[0]?[789]\d{9}$/;

app.directive("nameDirective", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attr, mCtrl) {
      function myValidation(value) {
        if (!value.includes("@")) {
          mCtrl.$setValidity("", true);
        } else {
          mCtrl.$setValidity("", false);
        }
        return value;
      }
      mCtrl.$parsers.push(myValidation);
    },
  };
});

let password;
app.directive("passwordDirective", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attr, mCtrl) {
      function myValidation(value) {
        if (passRegex.test(value)) {
          mCtrl.$setValidity("", true);
        } else {
          mCtrl.$setValidity("", false);
        }
        password = value;
        return value;
      }
      mCtrl.$parsers.push(myValidation);
    },
  };
});
app.directive("confirmDirective", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attr, mCtrl) {
      function myValidation(value) {
        if (value === password) {
          mCtrl.$setValidity("", true);
        } else {
          mCtrl.$setValidity("", false);
        }
        return value;
      }
      mCtrl.$parsers.push(myValidation);
    },
  };
});
app.directive("emailDirective", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attr, mCtrl) {
      function myValidation(value) {
        if (emailRegex.test(value)) {
          mCtrl.$setValidity("", true);
        } else {
          mCtrl.$setValidity("", false);
        }
        return value;
      }
      mCtrl.$parsers.push(myValidation);
    },
  };
});
app.directive("mobileDirective", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attr, mCtrl) {
      function myValidation(value) {
        if (mobileRegex.test(value)) {
          mCtrl.$setValidity("", true);
        } else {
          mCtrl.$setValidity("", false);
        }
        return value;
      }
      mCtrl.$parsers.push(myValidation);
    },
  };
});

app.controller(
  "UpdateUser",
  function ($scope, $http, $stateParams, StorageService) {
    var change = false;
    // $scope.change = function () {
    //   change = true;
    //   console.log(change);
    // };
    const userId = StorageService.get();
    console.log(typeof userId);
    $http({
      method: "GET",
      url: `http://localhost:3000/userDetails/${userId}`,
    })
      .then(function (response) {
        $scope.user = response.data.user;
      })
      .catch(function (err) {
        console.log(err.message);
      });
    // $location.path("/user").replace();

    $scope.updateUser = function () {
      let updatedUser = {
        // firstName: $scope.user.firstName,
        // lastName: $scope.user.lastName,
        // username: $scope.user.username,
        // email: $scope.user.email,
        // contactNo: $scope.user.contactNo,
      };
      $scope.$watch(
        "user",
        function (newValue, oldValue) {
          if (newValue.firstName != oldValue.firstName && newValue.firstName) {
            updatedUser.firstName = newValue.firstName;
          }
          if (newValue.lastName != oldValue.lastName && newValue.lastName) {
            updatedUser.lastName = newValue.lastName;
          }
          if (newValue.username != oldValue.username && newValue.username) {
            userName = newValue.username;
          }
          if (newValue.email != oldValue.email && newValue.email) {
            updatedUser.email = newValue.email;
          }
          if (newValue.contactNo != oldValue.contactNo && newValue.contactNo) {
            updatedUser.contactNo = newValue.contactNo;
          }
          if (newValue.password != oldValue.password && newValue.password) {
            updatedUser.password = newValue.password;
          }

          // $http({
          //   method: "PUT",
          //   url: `http://localhost:3000/user/${userId}`,
          //   data: updatedUser,
          // })
          //   .then(function (response) {
          //     console.log(response.data);
          //     $location.path("/registerForm");
          //     console.log("Updated successfully");
          //   })
          //   .catch(function (error) {
          //     console.log(error);
          //   });
        },
        true
      );
    };
  }
);
