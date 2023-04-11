app.service("TicketService", function ($http) {
  function getAllAgentTickets(id) {
    return $http({
      method: "GET",
      url: "http://localhost:3000/tickets/agentTickets/" + id,
    });
  }

  function createTicket(ticket, id, username, file) {
    // var file = file;
    var fd = new FormData();

    var owner = {
      _id: id,
      username: username,
    };
    var reportedBy = {
      name: ticket.reporterName,
      companyName: ticket.companyName,
    };

    fd.append("owner", JSON.stringify(owner));
    fd.append("reportedBy", JSON.stringify(reportedBy));
    fd.append("source", ticket.source);
    fd.append("priority", ticket.priority);
    fd.append("ticketSubject", ticket.ticketSubject);
    fd.append("ticketDescription", ticket.ticketDescription);
    fd.append("myFile", file);
    console.log(fd);
    return $http.post("http://localhost:3000/tickets", fd, {
      transformRequest: angular.identity,
      headers: { "Content-Type": undefined },
    });
  }

  function getTicketlogs(id) {
    return $http.get("http://localhost:3000/tickets/logs/" + id);
  }

  function getAllUserTickets(id) {
    return $http({
      method: "GET",
      url: "http://localhost:3000/tickets/admin/" + id,
    });
  }

  function getCountOfAllAdminTickets(id) {
    return $http({
      method: "GET",
      url: "http://localhost:3000/tickets/admin/count/" + id,
    });
  }

  function getAgentTickets(id) {
    return $http({
      method: "GET",
      url: "http://localhost:3000/tickets/agent/" + id,
    });
  }

  function getTicketRequests(id) {
    return $http({
      method: "GET",
      url: "http://localhost:3000/tickets/requests/" + id,
    });
  }

  function updateTicketById(ticketId, agent) {
    const data = {
      ticketRequest: {
        to: agent._id,
        type: "assign",
        accepted: false,
      },
    };

    return $http({
      method: "PUT",
      url: "http://localhost:3000/tickets/" + ticketId,
      data: data,
    });
  }

  function sendRequest(ticketId, agent) {
    const data = {
      ticketRequest: {
        to: agent._id,
        type: "assign",
        accepted: false,
      },
    };
    return $http({
      method: "PUT",
      url: "http://localhost:3000/tickets/" + ticketId,
      data: data,
    });
  }

  function sendReAssignTicket(ticketId, agent) {
    const data = {
      ticketRequest: {
        to: agent._id,
        type: "re-assign",
        accepted: false,
      },
      modifiedAt: new Date(),
    };

    return $http({
      method: "PUT",
      url: "http://localhost:3000/tickets/" + ticketId,
      data: data,
    });
  }

  function closeTicket(ticketId) {
    const data = {
      status: "Closed",
      modifiedAt: new Date(),
      disabled: true,
      closedAt: new Date(),
    };

    return $http({
      method: "PUT",
      url: "http://localhost:3000/tickets/" + ticketId,
      data: data,
    });
  }
  function escalateTicket(ticketId, escalatedAgent) {
    const data = {
      ticketRequest: {
        to: escalatedAgent._id,
        type: "escalate",
        accepted: false,
      },
    };

    return $http({
      method: "PUT",
      url: "http://localhost:3000/tickets/" + ticketId,
      data: data,
    });
  }

  function acceptTicketRequest(ticketId, loggedInUser) {
    let data;
    data = {
      ticketRequest: {
        to: null,
        type: null,
        accepted: true,
      },
      assignedTo: {
        _id: loggedInUser.id,
        username: loggedInUser.username,
        isDisabled: loggedInUser.isDisabled,
      },
      status: "In Progress",
      modifiedAt: new Date(),
    };
    return $http({
      method: "PUT",
      url: "http://localhost:3000/tickets/" + ticketId,
      data: data,
    });
  }

  function rejectTicketRequest(ticketId) {
    let data;
    data = {
      ticketRequest: {
        to: null,
        type: null,
        accepted: false,
      },
    };
    return $http({
      method: "PUT",
      url: "http://localhost:3000/tickets/" + ticketId,
      data: data,
    });
  }

  function createNewTicketLog(data) {
    return $http({
      method: "POST",
      url: "http://localhost:3000/ticketLog",
      data,
    });
  }

  function getTicketById(ticketId) {
    return $http({
      method: "GET",
      url: "http://localhost:3000/tickets/" + ticketId,
    });
  }

  return {
    getAllAgentTickets,
    createTicket,
    getAllUserTickets,
    getAgentTickets,
    getTicketRequests,
    updateTicketById,
    createNewTicketLog,
    getTicketById,
    sendReAssignTicket,
    closeTicket,
    escalateTicket,
    sendRequest,
    rejectTicketRequest,
    acceptTicketRequest,
    getCountOfAllAdminTickets,
    getTicketlogs,
  };
});
