app.factory("AuthService", function ($http) {
  return {
    setLocalStorage: function (responseObj) {
      const split = responseObj.expiresIn.split("");
      const expiresIn = moment().add(parseInt(split[0]), split[1]);

      localStorage.setItem("token", responseObj.token);
      localStorage.setItem("expiresIn", JSON.stringify(expiresIn.valueOf()));
      const userDetails = {
        id: responseObj.user._id,
        username: responseObj.user.username,
        firstName: responseObj.user.firstName,
        lastName: responseObj.user.lastName,
        role: responseObj.user.role,
        isDisabled: responseObj.user.isDisabled,
        permissions: responseObj.user.permissions,
        // avatar: responseObj.user.avatar.imageUrl,
      };
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    },
    login: function (username, password) {
      return $http({
        method: "POST",
        url: "http://localhost:3000/login",
        data: { username, password },
      });
    },
    logout: function () {
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("userDetails");
    },
    isLoggedIn: function () {
      return moment().isBefore(this.getExpiration());
    },
    isLoggedOut: function () {
      return !this.isLoggedIn();
    },
    getExpiration: function () {
      const expiration = localStorage.getItem("expiresIn");
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    },
  };
});
