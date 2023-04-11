app.service("ChatService", function ($http) {
  var socket = io("http://localhost:3000");

  function getChats(queryId, receiverId) {
    return $http.get(
      `http://localhost:3000/chats?sender=${queryId}&receiver=${receiverId}`
    );
  }

  function sendChat(chat) {
    return $http.post("http://localhost:3000/chats", chat);
  }

  function on(eventName, callback) {
    socket.on(eventName, callback); // register event listener
  }

  function emit(eventName, data) {
    socket.emit(eventName, data); // emit event
  }

  return {
    getChats,
    sendChat,
    on,
    emit,
  };
});
