app.service("UserService", function ($http) {
  function getUsersOfOwner(id) {
    return $http({
      method: "GET",
      url: "http://localhost:3000/users/" + id,
    });
  }

  function getAgentTickets(agentId) {
    return $http({
      method: "GET",
      url: "http://localhost:3000/tickets/agentTickets/" + agentId,
    });
  }

  function addAgent(agent, id, firstName) {
    const newAgent = {
      ...agent,
      createdBy: { _id: id, name: firstName },
    };
    return $http({
      method: "POST",
      url: "http://localhost:3000/register",
      data: newAgent,
    });
  }

  function addAdmin(admin, createdBy) {
    console.log(createdBy);
    const adminObj = {
      ...admin,
      createdBy: createdBy,
      role: "Admin",
    };
    return $http({
      method: "POST",
      url: "http://localhost:3000/register",
      data: adminObj,
    });
  }

  function getUserById(userId, data) {
    return $http({
      method: "PUT",
      url: "http://localhost:3000/user/" + userId,
      data: data,
    });
  }
  function getAllUser() {
    return $http({
      method: "GET",
      url: "http://localhost:3000/users",
    });
  }

  function getBrandAdmins() {
    return $http.get("http://localhost:3000/brandAdmins");
  }

  return {
    getUsersOfOwner,
    getAgentTickets,
    addAgent,
    getUserById,
    getAllUser,
    getBrandAdmins,
    addAdmin,
  };
});
