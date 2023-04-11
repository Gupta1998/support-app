app.controller(
  "SuperAdmin",
  function (
    $scope,
    $http,
    $state,
    AuthService,
    BrandService,
    ToastNotifications,
    UserService
  ) {
    $scope.loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
    ToastNotifications.setOptions();

    BrandService.getBrands()
      .then(function (response) {
        $scope.brands = response.data.brands;
      })
      .catch(function (error) {
        console.log(error);
      });

    $scope.showAdmins = false;
    $scope.brandName = "Brand";
    $scope.viewAdmins = function (brand) {
      BrandService.getBrandAdmins(brand._id)
        .then(function (response) {
          $scope.brandName = brand.name;
          $scope.showAdmins = true;
          console.log(response.data);
          $scope.admins = response.data.admins;
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.showSubMenu = false;
    $scope.manageBrands = function () {
      $scope.showSubMenu = !$scope.showSubMenu;
    };

    // $scope.showModal = false;
    // $scope.showAddBrandModal = false;
    // $scope.showUpdateBrandModal = false;
    // $scope.showAddAdminModal = false;
    // $scope.showEditBrandModal = false;
    // $scope.showEditAdminModal = false;

    $scope.OpenAddBrandModal = function () {
      $scope.showModal = true;
      $scope.showAddBrandModal = !$scope.showAddBrandModal;
    };

    $scope.OpenUpdateBrandModal = function () {
      $scope.showModal = true;
      $scope.showUpdateBrandModal = !$scope.showUpdateBrandModal;
    };

    $scope.openEditBrandModal = function (brand) {
      $scope.brand = brand;
      console.log($scope.brand);
      $scope.showModal = true;
      $scope.showEditBrandModal = !$scope.showEditBrandModal;
    };

    $scope.openEditAdminModal = function (admin) {
      $scope.admin = admin;
      $scope.showModal = true;
      $scope.showEditAdminModal = !$scope.showEditAdminModal;
    };

    $scope.openAddAdminModal = function () {
      $scope.showModal = true;
      $scope.showAddAdminModal = !$scope.showAddAdminModal;
    };

    $scope.closeModal = function () {
      $scope.showModal = false;
      $scope.showAddBrandModal = false;
      $scope.showUpdateBrandModal = false;
      $scope.showAddAdminModal = false;
      $scope.showEditBrandModal = false;
      $scope.showEditAdminModal = false;
    };

    $scope.selectedFile = null;
    document.getElementById("logo").addEventListener("change", function () {
      $scope.selectedFile = this.files[0];
    });

    // addBrand
    $scope.addBrand = function () {
      BrandService.createBrand($scope.newBrand, $scope.myFile)
        .then(function (response) {
          if (response.data.success) {
            console.log(response.data);
            $scope.brands.push(response.data.brand);
            ToastNotifications.success("Brand Added Successfully!");
          }
          ToastNotifications.error(response.data.msg);
        })
        .catch(function (err) {
          console.log(err);
        });
      $scope.closeModal();
      $scope.newBrand = {};
    };

    // edit admin
    $scope.editAdmin = function () {};

    // Add Admin
    $scope.addAdmin = function () {
      console.log($scope.newAdmin);
      UserService.addAdmin($scope.newAdmin, $scope.loggedInUser)
        .then(function (res) {
          console.log(res.data);
          if (res.data.success) {
            ToastNotifications.success("Admin Created Successfully!");
          } else {
            ToastNotifications.success(
              "Error Creating Admin. Please Try Again!"
            );
          }
        })
        .catch(function (err) {
          console.log(er);
        });
      $scope.addAdmin = {};
      $scope.closeModal();
    };

    $scope.logout = function () {
      AuthService.logout();
      $state.go("login");
    };
  }
);
