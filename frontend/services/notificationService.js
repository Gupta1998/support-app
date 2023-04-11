app.service("NotificationService", function ($http, $rootScope) {
  var socket = io("http://localhost:3000");

  function getNotifications(userId) {
    return $http.get("http://localhost:3000/notifications/" + userId, {});
  }

  function sendNotification(sender, receiver, message) {
    const notification = {
      from: {
        _id: sender.id,
        username: sender.username,
        role: sender.role,
      },
      to: { _id: receiver._id, username: receiver.username },
      message,
    };

    return $http.post("http://localhost:3000/notifications", notification, {});
  }

  function on(eventName, callback) {
    socket.on(eventName, callback); // register event listener
  }

  function emit(eventName, data) {
    socket.emit(eventName, data); // emit event
  }

  return {
    getNotifications,
    sendNotification,
    on,
    emit,
  };
});
