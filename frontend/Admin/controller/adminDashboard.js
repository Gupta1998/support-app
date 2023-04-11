app.controller(
  "AdminDashboard",
  function (
    $scope,
    $http,
    $state,
    $rootScope,
    NotificationService,
    AuthService,
    TicketService,
    UserService,
    ToastNotifications,
    FilterService,
    ChatService,
    $timeout,
    $sce
  ) {
    // const start = moment("2023-04-05T15:08:11.015Z");
    // console.log(start);
    // const end = moment("2023-04-07T15:31:55.497Z");
    // const diff = end.diff(start, "days");
    // const diff2 = moment().diff(moment("2023-04-05T15:08:11.015Z"), "days");
    // console.log(diff, diff2);
    // console.log(diff == diff2);

    const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
    ToastNotifications.setOptions();

    $scope.LoggedInUserId = loggedInUser.id;
    $scope.LoggedInUsername = loggedInUser.username;
    $scope.userRole = loggedInUser.role;
    $scope.tickets = [];

    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.totalTickets = 0;

    TicketService.getCountOfAllAdminTickets(loggedInUser.id)
      .then(function (response) {
        const tickets = response.data.count;
        $scope.totalTickets = response.data.count;
        console.log("total tickets: " + $scope.totalTickets);
      })
      .catch(function (error) {
        console.log(error);
      });

    var url =
      "http://localhost:3000/tickets/admin/" +
      loggedInUser.id +
      // "/" +
      // JSON.stringify(filterObj) +
      "?start=" +
      ($scope.currentPage - 1) * $scope.itemsPerPage +
      "&limit=" +
      $scope.itemsPerPage;

    $http.get(url).then(function (response) {
      $scope.tickets = response.data.tickets;
      $scope.openTickets = $scope.tickets.filter(
        (ticket) => ticket.status == "Open"
      );
      $scope.closedTickets = $scope.tickets.filter(
        (ticket) => ticket.status == "Closed"
      );
      $scope.escalatedTickets = $scope.tickets.filter(
        (ticket) => ticket.status == "Escalated"
      );
    });

    $scope.previous = function () {
      if ($scope.currentPage == 1) {
        return;
      }
      $scope.currentPage -= 1;
      console.log($scope.currentPage);
      var url =
        "http://localhost:3000/tickets/admin/" +
        loggedInUser.id +
        "?start=" +
        ($scope.currentPage - 1) * $scope.itemsPerPage +
        "&limit=" +
        $scope.itemsPerPage;
      $http.get(url).then(function (response) {
        $scope.tickets = response.data.tickets;
        $scope.openTickets = $scope.tickets.filter(
          (ticket) => ticket.status == "Open"
        );
        $scope.closedTickets = $scope.tickets.filter(
          (ticket) => ticket.status == "Closed"
        );
        $scope.escalatedTickets = $scope.tickets.filter(
          (ticket) => ticket.status == "Escalated"
        );
      });
    };

    $scope.next = function () {
      if ($scope.currentPage >= $scope.totalTickets / 10) {
        return;
      }
      $scope.currentPage += 1;
      console.log($scope.currentPage);
      var url =
        "http://localhost:3000/tickets/admin/" +
        loggedInUser.id +
        "?start=" +
        ($scope.currentPage - 1) * $scope.itemsPerPage +
        "&limit=" +
        $scope.itemsPerPage;
      $http.get(url).then(function (response) {
        $scope.tickets = response.data.tickets;
        $scope.openTickets = $scope.tickets.filter(
          (ticket) => ticket.status == "Open"
        );
        $scope.closedTickets = $scope.tickets.filter(
          (ticket) => ticket.status == "Closed"
        );
        $scope.escalatedTickets = $scope.tickets.filter(
          (ticket) => ticket.status == "Escalated"
        );
      });
    };

    UserService.getUsersOfOwner(loggedInUser.id)
      .then(function (response) {
        $scope.agents = response.data.users;
        $scope.activeAgents = $scope.agents.filter((user) => {
          if (user.status === "Online" && user.isDisabled === "false")
            return user;
        });
        console.log($scope.agents);
      })
      .catch(function (error) {
        console.log(error);
      });

    $scope.getAgentAssignedTicketCount = function (agent) {
      UserService.getAgentTickets(agent._id)
        .then(function (response) {
          console.log("Agent assigned tickets: ", response.data.tickets.length);
          $scope.ticketsAssigned = response.data.tickets.length;
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    $scope.notifications = [];
    $scope.showNotifications = $scope.notifications.length > 0;
    $rootScope.loggedInUser = JSON.parse(localStorage.getItem("userDetails"));

    angular.element(".fa-bell").on("mouseenter", function () {
      angular.element(".notifications").removeClass("hide");
    });
    angular.element(".notifications").on("mouseleave", function () {
      angular.element(".notifications").addClass("hide");
    });

    // Emit the 'join' event to the server
    NotificationService.emit("join", $rootScope.loggedInUser.id);

    // get user's notifications
    NotificationService.getNotifications($rootScope.loggedInUser.id).then(
      function (response) {
        $scope.notifications = response.data;
      }
    );

    NotificationService.on("notification", function (notification) {
      ToastNotifications.info("New Notification Received!");
      $scope.$apply(function () {
        $scope.notifications.push(notification);
      });
    });

    $scope.sendTicketRequest = function (ticket, agent) {
      console.log("hello");
      // send notification
      const message = "New Ticket Request!";

      TicketService.sendRequest(ticket._id, agent)
        .then(function (res) {
          console.log(res.data);

          // send notification
          NotificationService.sendNotification(
            $rootScope.loggedInUser,
            agent,
            message
          ).then(function (response) {
            console.log(response.data);
            NotificationService.emit("notification", response.data);
            $scope.notifications.push(response.data);
          });

          // set toast notif
          ToastNotifications.info("Ticket Request Sent!");
        })
        .catch(function (err) {
          console.log(err);
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

    $scope.addAgent = function () {
      console.log($scope.agent);
      UserService.addAgent(
        $scope.agent,
        loggedInUser.id,
        loggedInUser.FirstName
      )
        .then(function (response) {
          console.log(response.data);
          $scope.agents.push(agent);
          ToastNotifications.success("Agent Added Successfully!");
        })
        .catch(function (err) {
          console.log(err);
        });
      $scope.agent = {};
    };

    $scope.selectedFile = null;
    document
      .getElementById("fileInput")
      .addEventListener("change", function () {
        $scope.selectedFile = this.files[0];
      });

    $scope.createTicket = function () {
      console.log($scope.selectedFile);
      TicketService.createTicket(
        $scope.ticket,
        loggedInUser.id,
        loggedInUser.username,
        $scope.myFile
      )
        .then(function (response) {
          console.log($scope.tickets);
          $scope.tickets.unshift(response.data.ticket);
          // $scope.$apply();
          ToastNotifications.success("Ticket Created!");
        })
        .catch(function (err) {
          console.log(err.message);
        });
      $scope.closeModal();
      $scope.ticket = {};
    };

    $scope.createChatTicket = function () {
      TicketService.createTicket(
        $scope.ticket,
        loggedInUser.id,
        loggedInUser.username,
        $scope.myFile
      )
        .then(function (response) {
          console.log(response.data.ticket);
          $scope.tickets.push(response.data.ticket);
          console.log($scope.tickets);
          ToastNotifications.success("Ticket Created!");
        })
        .catch(function (err) {
          console.log(err.message);
        });
      $scope.ticket = {};
    };

    $scope.openConfirmDeleteModal = function (ticket) {
      $("#confirmDeleteModal").modal("show");
      $scope.ticketToDelete = ticket._id;
    };

    $scope.deleteTicket = function () {
      console.log($scope.ticketToDelete);

      const data = {
        isDeleted: true,
      };

      TicketService.updateTicketById($scope.ticketToDelete, data)
        .then(function (res) {
          ToastNotifications.success("Deleted!");
          console.log(res.data);
          $scope.tickets = $scope.tickets.filter(function (tkt) {
            return $scope.ticketToDelete !== tkt._id;
          });
        })
        .catch(function (err) {
          console.log(err);
        });
      $("#confirmDeleteModal").modal("hide");
    };

    // sidebar-left
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

    // sidebar-right
    $scope.openRightSidebar = function () {
      angular.element("#sidebarRight").css("width", "300px");
      // angular
      //   .element(".views")
      //   .css({ "margin-right": "250px", transition: "margin-right .5s" });
    };

    $scope.closeRightSidebar = function () {
      angular.element("#sidebarRight").css("width", "0");
      angular.element(".views").css("margin-right", "0");
    };

    // Check if checkbox is checked or not
    $scope.checkVal = function () {
      var checkedAgents = [];
      $scope.agents.forEach(function (agent) {
        if (agent.selected) {
          checkedAgents.push(agent._id);
        } else {
        }
      });
      console.log(checkedAgents);
      checkedAgents.forEach(function (id) {
        disableAgents(id);
      });
    };

    $scope.checkValue = function (agent) {
      if (agent.checked) {
        console.log(agent.checked);
        enableAgent(agent._id);
      } else {
        console.log(agent.checked);
        disableAgent(agent._id);
      }
    };

    function disableAgent(id) {
      UserService.getUserById(id, { isDisabled: "true" })
        .then(function (response) {
          console.log(response.data);
          ToastNotifications.warning("Agent Disabled");
          $scope.agents = $scope.agents.filter(function (agent) {
            return agent.id !== id;
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    }

    function enableAgent(id) {
      $scope.agents = $scope.agents.filter(function (agent) {
        return agent.id !== id;
      });

      UserService.getUserById(id, { isDisabled: "false" })
        .then(function (response) {
          console.log(response.data);
          ToastNotifications.info("Agent Enabled");
        })
        .catch(function (err) {
          console.log(err);
        });
    }

    $scope.heading = "All Tickets";
    $scope.showAllAgents = function () {
      $scope.heading = "All Agents";
    };
    $scope.showAllTickets = function () {
      $scope.heading = "All Tickets";
    };
    $scope.showQuickTickets = function () {
      $scope.heading = "Quick View";
    };

    $scope.showModal = false;
    $scope.showAddAgentModal = false;
    $scope.showRemoveAgentModal = false;
    $scope.showCreateTicketModal = false;
    $scope.showFilterModal = false;
    $scope.showCreateChatTicket = false;

    $scope.openAddAgentModal = function () {
      $scope.showModal = true;
      $scope.showAddAgentModal = true;
    };
    $scope.openRemoveAgentModal = function () {
      $scope.showModal = true;
      $scope.showRemoveAgentModal = true;
    };
    $scope.openCreateTicketModal = function () {
      $scope.showModal = true;
      $scope.showCreateTicketModal = true;
    };
    $scope.openFilterModal = function () {
      $scope.showModal = true;
      $scope.showFilterModal = true;
    };
    $scope.openCreateChatTicket = function () {
      $scope.showModal = true;
      $scope.showCreateChatTicket = true;
    };

    $scope.closeModal = function () {
      $scope.showModal = false;
      $scope.showAddAgentModal = false;
      $scope.showRemoveAgentModal = false;
      $scope.showCreateTicketModal = false;
      $scope.showFilterModal = false;
    };

    $scope.showProfileMenu = false;
    $scope.openProfileMenu = function () {
      $scope.showProfileMenu = !$scope.showProfileMenu;
      console.log("clicked");
    };

    $scope.filterTickets = function () {
      console.log($scope.filter);
      // $state.reload();
      // FilterService.filterTickets($scope.filter)
      //   .then(function (res) {
      //     console.log(res.data);
      //     $scope.tickets = [];
      //     console.log("Now tickets are ", $scope.tickets);
      //   })
      //   .catch(function (err) {});
    };

    $scope.logout = function () {
      ToastNotifications.success("Logged Out!");
      AuthService.logout();
      $state.go("login");
    };

    $scope.userId = JSON.parse(localStorage.getItem("userDetails")).id;
    // const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
    $scope.sendMessages = [];
    $scope.receivedMessages = [];
    $scope.receiverDetails;
    var chatHistory = [];

    // Emit the 'join' event to the server
    ChatService.emit("join", $scope.userId);

    ChatService.on("message", function (message) {
      $scope.receiverDetails = message.sender;
      console.log($scope.receiverDetails);
      $scope.$apply(function () {
        $scope.receivedMessages.push(message);
        console.log($scope.receivedMessages);
        console.log($scope.sendMessages);
      });
    });

    $scope.receiver;
    $scope.startChat = function (admin) {
      $scope.chatWithPerson = admin.firstName;
      $scope.receiver = admin;
    };

    // send messages
    $scope.sendMessage = function () {
      message = {
        chatId: Date.now(),
        sender: {
          name: "Sarah",
          companyName: "DOCOMO",
        },
        receiver: {
          _id: $scope.receiverDetails._id,
          username: $scope.receiverDetails.username,
        },
        chat: $scope.messageText,
      };
      ChatService.emit("message", message);
      $scope.sendMessages.push(message);
      $scope.messageText = "";
    };

    // ChatService.on("disconnect", message);

    $scope.closeChat = function () {
      console.log("closed");
      $scope.sendMessages = [];
      $scope.receivedMessages = [];
      // emit a message to the server indicating that the user has left the chat
      ChatService.emit("userLeft", $scope.sendMessages);
    };
  }
);
