app.controller(
  "TicketDetails",
  function (
    $scope,
    $http,
    $stateParams,
    $rootScope,
    TicketService,
    CommentService,
    UserService,
    moment,
    ToastNotifications
  ) {
    ToastNotifications.setOptions();
    const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
    $scope.loggedInUser = loggedInUser;
    const ticketId = $stateParams.id;
    $scope.comments = [];

    console.log(loggedInUser);

    TicketService.getTicketById(ticketId)
      .then(function (response) {
        $scope.ticket = response.data.ticket;
      })
      .catch(function (err) {
        console.log(err);
      });

    UserService.getAllUser()
      .then(function (response) {
        $scope.agents = response.data.users.filter((user) => {
          if (
            user.isDisabled === "false" &&
            user.status === "Online" &&
            user.role !== "Admin" &&
            user.role !== "Super Admin" &&
            user._id !== loggedInUser.id
          )
            return user;
        });
        console.log($scope.agents);
      })
      .catch(function (error) {
        console.log(error);
      });

    TicketService.getTicketlogs(ticketId)
      .then(function (response) {
        if (response.data) {
          console.log(
            "Ticket log: " + JSON.stringify(response.data.ticketLogs)
          );
          $scope.ticketLogs = response.data.ticketLogs;
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    // sidebar-right
    $scope.openRightSidebar = function () {
      angular.element("#sidebarRight").css("width", "300px");
      // angular
      //   .element(".views")
      //   .css({ "margin-right": "250px", transition: "margin-right .5s" });
    };

    $scope.closeRightSidebar = function () {
      angular.element("#sidebarRight").css("width", "0");
    };

    CommentService.getCommentsOfUserOnTicket(loggedInUser.id, ticketId)
      .then(function (response) {
        console.log(response.data);
        $scope.comments = response.data.comments;
      })
      .catch(function (err) {
        console.log(err);
      });

    function addComment(loggedInUser, ticket, message) {
      CommentService.addComment(loggedInUser, ticket, message)
        .then(function (response) {
          console.log(response.data);
          $scope.comments.push(response.data.comment);
          ToastNotifications.success("Comment Added!");
        })
        .catch(function (err) {
          console.log(err);
        });
      message = "";
    }

    $scope.addComment = function () {
      addComment(loggedInUser, $scope.ticket, $scope.comment.message);
    };

    $scope.showComments = true;
    $scope.showDesc = false;
    $scope.showResolution = false;

    $scope.openCommentSection = function (event) {
      $scope.showComments = true;
      $scope.showDesc = false;
      $scope.showResolution = false;
    };

    $scope.openDescSection = function (event) {
      $scope.showDesc = true;
      $scope.showComments = false;
      $scope.showResolution = false;
    };

    $scope.openResolution = function (event) {
      $scope.showResolution = true;
      $scope.showComments = false;
      $scope.showDesc = false;
    };

    $scope.changeTicketStatus = function (value) {
      if (value === "Close") {
        $("#closeModal").modal("show");
      } else if (value === "Escalate") {
        $("#escalateModal").modal("show");
      } else if (value === "Resolve") {
        $("#resolveModal").modal("show");
      }
    };

    $scope.reAssignTicket = function (agent) {
      // re-assign the ticket and update
      TicketService.sendReAssignTicket($scope.ticket._id, agent)
        .then(function (response) {
          console.log(response.data);
          ToastNotifications.success("Ticket ReAssigned Request Sent!");
          $scope.ticket.modifiedAt = modifiedAt;
        })
        .catch(function (err) {
          console.log(err);
        });

      // create new ticket log
      TicketService.createNewTicketLog({
        ticket: $scope.ticket,
      })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    // Close Ticket
    $scope.closeTicket = function () {
      // create new ticket log
      TicketService.createNewTicketLog({
        ticket: $scope.ticket,
      })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (err) {
          console.log(err);
        });

      // update the ticket
      TicketService.closeTicket($scope.ticket._id)
        .then(function (response) {
          console.log(response.data);
          const modifiedAt = new Date();
          $scope.ticket.status = "Closed";
          $scope.ticket.disabled = true;
          $scope.ticket.modifiedAt = modifiedAt;
          ToastNotifications.success("Ticket Closed!");
        })
        .catch(function (err) {
          console.log(err);
        });

      if ($scope.closeComment) {
        addComment(loggedInUser, $scope.ticket, $scope.closeComment);
      }
      $("#closeModal").modal("hide");
    };

    $scope.escalateTicketTo = function (agent) {
      $scope.escalatedAgent = agent;
    };

    // Escalate Ticket
    $scope.escalateTicket = function () {
      // modify the current ticket status and assign to escalated person
      TicketService.escalateTicket($scope.ticket._id, $scope.escalatedAgent)
        .then(function (response) {
          console.log(response.data);
          $scope.ticket.disabled = true;
          $scope.ticket.status = "Escalated";
          $scope.ticket.modifiedAt = Date.now();
          $scope.ticket.escalatedTo = escalatedTo;
          $scope.ticket.disabled = true;
          ToastNotifications.success("Ticket Escalate Request Sent!");
        })
        .catch(function (err) {
          console.log(err);
        });

      if ($scope.escalateComment) {
        addComment(loggedInUser, $scope.ticket, $scope.escalateComment);
      }
      $scope.escalateComment = "";
      $("#escalateModal").modal("show");
    };

    $scope.resolveTicket = function () {
      if ($scope.resolveComment) {
        addComment(loggedInUser, $scope.ticket, $scope.resolveComment);
      }
      $scope.ticket.disabled = true;
      ToastNotifications.success("Ticket Resolved!");
      $("#resolveModal").modal("show");
    };
  }
);
