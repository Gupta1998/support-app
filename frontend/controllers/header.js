app.controller("HeaderController", function (AuthService, $state) {
  var vm = this;
  vm.loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
  console.log(loggedInUser);

  vm.logout = function () {
    console.log("hello");
    AuthService.logout();
    $state.go("login");
  };
});
