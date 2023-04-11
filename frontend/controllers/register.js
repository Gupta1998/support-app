const emailRegExp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
const mobileRegEx = /^[0]?[789]\d{9}$/;

app.directive("nameDirective", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attr, mCtrl) {
      function myValidation(value) {
        if (!value.includes("@")) {
          console.log(value);
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

let pass;
app.directive("passwordDirective", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attr, mCtrl) {
      function myValidation(value) {
        if (passRegEx.test(value)) {
          console.log(value);
          mCtrl.$setValidity("", true);
        } else {
          mCtrl.$setValidity("", false);
        }
        pass = value;
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
        if (value === pass) {
          console.log(value);
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
        if (emailRegExp.test(value)) {
          console.log(value);
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
        if (mobileRegEx.test(value)) {
          console.log(value);
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

app.controller("formController", function ($scope, $location, $http) {
  $scope.addUser = function () {
    const user = {
      firstName: $scope.user.firstName,
      lastName: $scope.user.lastName,
      username: $scope.user.username,
      email: $scope.user.email,
      contactNo: $scope.user.contactNo,
      password: $scope.user.confirmPassword,
    };
    $http({
      method: "POST",
      url: "http://localhost:3000/register",
      data: user,
    })
      .then(function (response) {
        console.log(response.data);
        $location.path("/registerForm");
      })
      .catch(function (err) {
        console.log(err.message);
      });

    // addEntry(newUser);
  };
});

function addEntry(user) {
  // Parse the JSON stored in allEntriesP
  var existingEntries = JSON.parse(localStorage.getItem("users"));
  if (existingEntries == null) existingEntries = [];
  var entry = user;
  localStorage.setItem("entry", JSON.stringify(entry));
  // Save allEntries back to local storage
  existingEntries.push(entry);
  localStorage.setItem("users", JSON.stringify(existingEntries));
  delete localStorage.entry;
}
