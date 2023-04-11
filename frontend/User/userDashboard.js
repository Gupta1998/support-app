app.controller(
  "UserDashboard",
  function (
    $scope,
    $http,
    AuthService,
    $state,
    NotificationService,
    $rootScope,
    UserService,
    TicketService,
    ToastNotifications,
    PaginationFactory
  ) {
    ToastNotifications.setOptions();
    const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
    $scope.username = loggedInUser.username;
    $scope.userRole = loggedInUser.role;
    $scope.tickets = [];
    $scope.ticketRequests = [];

    $scope.openNotificationPanel = function () {
      angular.element(".arrow_box").toggleClass("hide");
    };

    // Pagination for tickets
    $scope.ticketCurrPage = 1;
    $scope.ticketItemsPerPage = 10;
    $scope.totalTickets = 0;

    TicketService.getTicketRequests(loggedInUser.id)
      .then(function (response) {
        console.log("Ticket Requests", response.data);
        $scope.ticketRequests = response.data.tickets;
      })
      .catch();

    TicketService.getAllAgentTickets(loggedInUser.id)
      .then(function (response) {
        console.log("Tickets", response.data);
        $scope.totalTickets = response.data.count;
        console.log($scope.totalTickets);
      })
      .catch(function (err) {
        console.log(err);
      });

    var ticketsUrl =
      "http://localhost:3000/tickets/agent/" +
      loggedInUser.id +
      "?start=" +
      ($scope.ticketCurrPage - 1) * $scope.ticketItemsPerPage +
      "&limit=" +
      $scope.ticketItemsPerPage;

    $http.get(ticketsUrl).then(function (response) {
      $scope.tickets = response.data.tickets;
    });

    $scope.previous = function () {
      if ($scope.ticketCurrPage == 1) return;
      else {
        $scope.ticketCurrPage -= 1;
        console.log($scope.ticketCurrPage);
        var ticketsUrl =
          "http://localhost:3000/tickets/agent/" +
          loggedInUser.id +
          "?start=" +
          ($scope.ticketCurrPage - 1) * $scope.ticketItemsPerPage +
          "&limit=" +
          $scope.ticketItemsPerPage;

        PaginationFactory.previous(ticketsUrl)
          .then(function (response) {
            $scope.tickets = response.data.tickets;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    };

    $scope.next = function () {
      if ($scope.ticketCurrPage == Math.ceil($scope.totalTickets / 10)) {
        return;
      } else {
        $scope.ticketCurrPage += 1;
        console.log($scope.ticketCurrPage);
        var ticketsUrl =
          "http://localhost:3000/tickets/agent/" +
          loggedInUser.id +
          "?start=" +
          ($scope.ticketCurrPage - 1) * $scope.ticketItemsPerPage +
          "&limit=" +
          $scope.ticketItemsPerPage;

        PaginationFactory.next(ticketsUrl)
          .then(function (response) {
            $scope.tickets = response.data.tickets;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    };

    UserService.getAllUser()
      .then(function (response) {
        $scope.agents = response.data.users.filter((user) => {
          if (user.isDisabled === "false") return user;
        });
        console.log($scope.agents);
      })
      .catch(function (error) {
        console.log(error);
      });

    $scope.ticketDetails = function (ticket, event) {
      event.stopPropagation();
      $state.go("ticketDetails", { id: ticket._id });
    };

    angular.element(".profile-img").on("click", function () {
      angular.element(".profile-menu").toggleClass("hide");
    });

    $scope.openSubmenu = function () {
      angular.element(".sidebar-submenu").toggleClass("hide");
    };

    $scope.openNav = function () {
      angular.element("#mySidebar").css("width", "250px");
      angular
        .element("#main")
        .css({ "margin-left": "250px", transition: "margin-left .5s" });
    };

    $scope.closeNav = function () {
      angular.element("#mySidebar").css("width", "0");
      angular.element("#main").css("margin-left", "0");
    };

    // notifications
    $scope.notifications = [];
    $scope.showNotifications = $scope.notifications.length > 0;
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
      ToastNotifications.info("New notification received!");
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
      });
    };

    // Mark a notification as read
    $scope.markAsRead = function (notification) {
      $http
        .put("http://localhost:3000/api/notifications/" + notification._id)
        .then(
          function (response) {
            console.log(response.data);
            $scope.notifications = $scope.notifications.filter(function (
              notif
            ) {
              return notif._id !== notification._id;
            });
          },
          function (error) {
            console.error(error);
          }
        );
    };

    // Accept ticket Request
    $scope.accept = function (ticket) {
      const message = "Ticket Request Accepted.";

      TicketService.acceptTicketRequest(ticket._id, loggedInUser)
        .then(function (response) {
          console.log(response.data);

          NotificationService.sendNotification(
            loggedInUser,
            ticket,
            message
          ).then(function (response) {
            console.log(response.data);
            NotificationService.emit("notification", response.data);
          });

          ToastNotifications.success("Accepted Ticket Request!");
          $scope.tickets.push(response.data.ticket);
          $scope.ticketRequests = $scope.ticketRequests.filter(function (tkt) {
            return tkt._id !== ticket._id;
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    // Reject Ticket Request
    $scope.reject = function (ticket) {
      const message = "Ticket Request Rejected";

      TicketService.rejectTicketRequest(ticket._id)
        .then(function (response) {
          console.log(response.data);

          NotificationService.sendNotification(
            loggedInUser,
            ticket,
            message
          ).then(function (response) {
            console.log(response.data);
            NotificationService.emit("notification", response.data);
          });

          ToastNotifications.success("Rejected Ticket Request!");
          $scope.ticketRequests = $scope.ticketRequests.filter(function (tkt) {
            return tkt._id !== ticket._id;
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    $scope.logout = function () {
      ToastNotifications.success("Logged Out!");
      AuthService.logout();
      $state.go("login");
    };
  }
);
