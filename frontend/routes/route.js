app.config([
  "$qProvider",
  function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  },
]);

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.when("/user_dashboard", "/user_dashboard/all_tickets");
  $urlRouterProvider.when(
    "/admin_dashboard",
    "/admin_dashboard/ticket_list_large"
  );
  $stateProvider
    .state("superAdmin_dashboard", {
      url: "/superAdmin_Dashboard",
      templateUrl: "./SuperAdmin/superadmin_view.html",
      controller: "SuperAdmin",
    })
    .state("brand_dashboard", {
      url: "/brand_Dashboard",
      templateUrl: "./Brand/brand_view.html",
      controller: "BrandDashboard",
    })
    .state("admin_dashboard", {
      url: "/admin_dashboard",
      templateUrl: "Admin/views/adminDashboard.html",
      controller: "AdminDashboard",
    })
    .state("admin_dashboard.all_agents", {
      url: "/all_agents",
      templateUrl: "Admin/views/all_agents.html",
      controller: "AdminDashboard",
    })
    .state("admin_dashboard.ticket_list_small", {
      url: "/ticket_list_small",
      templateUrl: "Admin/views/ticket_list_small.html",
      controller: "ticket_list_smallController",
    })
    .state("admin_dashboard.ticket_list_large", {
      url: "/ticket_list_large",
      templateUrl: "Admin/views/ticket_list_large.html",
      // controller: "AdminDashboard",
    })
    .state("admin_dashboard.analytics", {
      url: "/analytics",
      templateUrl: "Admin/views/analytics.html",
      controller: "AdminAnalyticsController",
    })
    .state("ticketDetails", {
      url: "/ticketDetails/:id",
      templateUrl: "TicketDetail/views/ticketDetails.html",
      params: { id: null },
      controller: "TicketDetails",
    })
    .state("ticketDetails.comments", {
      url: "/comments",
      templateUrl: "TicketDetail/views/comment.html",
      controller: "TicketDetails",
    })
    .state("ticketDetails.desc", {
      url: "/desc",
      templateUrl: "TicketDetail/views/desc.html",
      controller: "TicketDetails",
    })
    .state("updateUser", {
      url: "/updateUser",
      // params: { id: null },
      templateUrl: "views/updateForm.html",
      controller: "UpdateUser",
    })
    .state("user_dashboard", {
      url: "/user_dashboard",
      templateUrl: "User/views/userDashboard.html",
      controller: "UserDashboard",
    })
    .state("user_dashboard.ticket_requests", {
      url: "/ticket_requests",
      templateUrl: "User/views/ticket_requests.html",
      controller: "UserDashboard",
    })
    .state("user_dashboard.all_tickets", {
      url: "/all_tickets",
      templateUrl: "User/views/all_tickets.html",
      controller: "UserDashboard",
    })
    .state("user_profile", {
      url: "/user_profile/:id",
      params: { id: null },
      templateUrl: "views/profile_page.html",
      controller: "Profile",
    })
    .state("login", {
      url: "/login",
      templateUrl: "views/loginForm.html",
      controller: "Login",
    })
    .state("register", {
      url: "/register",
      templateUrl: "views/registerForm.html",
      controller: "formController",
    })
    .state("notification", {
      url: "/notification",
      templateUrl: "views/notification.html",
      controller: "NotificationController",
    })
    .state("chats", {
      url: "/chats",
      templateUrl: "chat/chatView.html",
      controller: "ChatController",
    });
  // $urlRouterProvider.otherwise("login");

  // Interceptor
  $httpProvider.interceptors.push(function () {
    return {
      request: function (req) {
        // Get the token from local storage
        const token = localStorage.getItem("token");
        // Set the `Authorization` header for every outgoing HTTP request
        req.headers.Authorization = token;
        return req;
      },
    };
  });
});
