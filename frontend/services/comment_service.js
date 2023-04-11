app.service("CommentService", function ($http) {
  function addComment(loggedInUser, ticket, message) {
    const comment = {
      commentedBy: {
        _id: loggedInUser.id,
        username: loggedInUser.username,
      },
      commentedOnticket: {
        _id: ticket._id,
        username: ticket.username,
      },
      comment: message,
    };

    return $http({
      method: "POST",
      url: "http://localhost:3000/comments",
      data: comment,
    });
  }

  function getCommentsOfUserOnTicket(userid, ticketId) {
    return $http({
      method: "GET",
      url: "http://localhost:3000/comments/" + userid + "/" + ticketId,
    });
  }

  return {
    addComment,
    getCommentsOfUserOnTicket,
  };
});
