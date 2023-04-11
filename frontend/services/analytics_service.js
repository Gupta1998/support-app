app.service("AnalyticsService", function ($http) {
  function getTicketsAssignedToEachUser() {
    return $http.get("http://localhost:3000/getTicketsAssignedToEachUser");
  }

  function findUsersEscalatedMostTickets() {
    return $http.get("http://localhost:3000/findUsersEscalatedMostTickets");
  }

  function findAverageTimeSpentOnTicketByEachAgent() {
    return $http.get(
      "http://localhost:3000/findAverageTimeSpentOnTicketByEachAgent"
    );
  }

  function findAvgClosingTime() {
    return $http.get("http://localhost:3000/findAvgClosingTime");
  }

  function finsUsersClosedMostTickets() {
    return $http.get("http://localhost:3000/finsUsersClosedMostTickets");
  }

  function getTop3TicketAssignedUsers() {
    return $http.get("http://localhost:3000/getTop3TicketAssignedUsers");
  }

  return {
    getTicketsAssignedToEachUser,
    findUsersEscalatedMostTickets,
    findAverageTimeSpentOnTicketByEachAgent,
    findAvgClosingTime,
    finsUsersClosedMostTickets,
    getTop3TicketAssignedUsers,
  };
});
