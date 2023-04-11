app.controller(
  "AdminAnalyticsController",
  function ($scope, TicketService, AnalyticsService) {
    const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
    TicketService.getAllUserTickets(loggedInUser.id)
      .then(function (response) {
        const tickets = response.data.tickets;
        $scope.tickets = tickets;
        $rootScope.tickets = $scope.tickets;
        $scope.openTickets = $scope.tickets.filter(
          (ticket) => ticket.status == "Open"
        );
        $scope.closedTickets = $scope.tickets.filter(
          (ticket) => ticket.status == "Closed"
        );
        $scope.escalatedTickets = $scope.tickets.filter(
          (ticket) => ticket.status == "Escalated"
        );
      })
      .catch(function (error) {
        console.log(error);
      });

    AnalyticsService.getTicketsAssignedToEachUser()
      .then(function (res) {
        console.log(res.data);
        const result = res.data.result;
        const labels = [];
        const labelData = [];

        result.forEach(function (element) {
          labels.push(element._id);
          labelData.push(element.ticketsAssigned);
        });

        // Design a Chart:
        const data = {
          labels: labels,
          datasets: [
            {
              label: "Tickets Assigned To Each User",
              data: labelData,
              backgroundColor: [
                "rgba(255, 26, 104, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(0, 0, 0, 0.2)",
              ],
              borderColor: [
                "rgba(255, 26, 104, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(0, 0, 0, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };
        const config = {
          type: "bar",
          data,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        };
        const myChart1 = new Chart(document.getElementById("myChart1"), config);
      })
      .catch();

    AnalyticsService.findUsersEscalatedMostTickets()
      .then(function (res) {
        console.log(res.data);
        const result = res.data.result;
        const labels = [];
        const labelData = [];

        result.forEach(function (element) {
          labels.push(element._id);
          labelData.push(element.count);
        });

        // Design a Chart:
        const data = {
          labels: labels,
          datasets: [
            {
              label: "Got Most Escalated Tickets",
              data: labelData,
              backgroundColor: [
                "rgba(255, 26, 104, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(0, 0, 0, 0.2)",
              ],
              borderColor: [
                "rgba(255, 26, 104, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(0, 0, 0, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };
        const config = {
          type: "bar",
          data,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        };
        const myChart2 = new Chart(document.getElementById("myChart2"), config);
      })
      .catch();
    AnalyticsService.findAverageTimeSpentOnTicketByEachAgent()
      .then(function (res) {
        console.log(res.data);
        const result = res.data.result;
        const labels = [];
        const labelData = [];

        result.forEach(function (element) {
          labels.push(element._id);
          labelData.push(element.avg_duration.toFixed(2));
        });

        // Design a Chart:
        const data = {
          labels: labels,
          datasets: [
            {
              label: "Avg Time Spent on Ticket(hours)",
              data: labelData,
              backgroundColor: [
                "rgba(255, 26, 104, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(0, 0, 0, 0.2)",
              ],
              borderColor: [
                "rgba(255, 26, 104, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(0, 0, 0, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };
        const config = {
          type: "pie",
          data,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        };
        const myChart3 = new Chart(document.getElementById("myChart3"), config);
      })
      .catch();
    AnalyticsService.findAvgClosingTime()
      .then(function (res) {
        console.log(res.data);
        const result = res.data.result;
        const labels = [];
        const labelData = [];

        result.forEach(function (element) {
          labels.push(element._id);
          labelData.push(element.avg_closing_time);
        });

        // Design a Chart:
        const data = {
          labels: labels,
          datasets: [
            {
              label: "Avg Closing Time(hours)",
              data: labelData,
              backgroundColor: [
                "rgba(255, 26, 104, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(0, 0, 0, 0.2)",
              ],
              borderColor: [
                "rgba(255, 26, 104, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(0, 0, 0, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };
        const config = {
          type: "pie",
          data,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        };
        const myChart4 = new Chart(document.getElementById("myChart4"), config);
      })
      .catch();
    AnalyticsService.finsUsersClosedMostTickets()
      .then(function (res) {
        console.log(res.data);
        const result = res.data.result;
        const labels = [];
        const labelData = [];

        result.forEach(function (element) {
          labels.push(element._id);
          labelData.push(element.count);
        });

        // Design a Chart:
        const data = {
          labels: labels,
          datasets: [
            {
              label: "Closed Tickets",
              data: labelData,
              backgroundColor: [
                "rgba(255, 26, 104, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(0, 0, 0, 0.2)",
              ],
              borderColor: [
                "rgba(255, 26, 104, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(0, 0, 0, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };
        const config = {
          type: "doughnut",
          data,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        };
        const myChart5 = new Chart(document.getElementById("myChart5"), config);
      })
      .catch();
    AnalyticsService.getTop3TicketAssignedUsers()
      .then(function (res) {
        console.log(res.data);
        const result = res.data.result;
        const labels = [];
        const labelData = [];

        result.forEach(function (element) {
          labels.push(element._id);
          labelData.push(element.count);
        });

        // Design a Chart:
        const data = {
          labels: labels,
          datasets: [
            {
              label: "Top 3 Assignee",
              data: labelData,
              backgroundColor: [
                "rgba(255, 26, 104, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(0, 0, 0, 0.2)",
              ],
              borderColor: [
                "rgba(255, 26, 104, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(0, 0, 0, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };
        const config = {
          type: "line",
          data,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        };
        const myChart6 = new Chart(document.getElementById("myChart6"), config);
      })
      .catch();
  }
);
