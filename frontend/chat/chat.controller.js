app.controller("ChatController", function ($scope, ChatService, UserService) {
  $scope.userId = JSON.parse(localStorage.getItem("userDetails")).id;
  const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
  $scope.sendMessages = [];
  $scope.receivedMessages = [];
  var chatHistory = [];

  UserService.getBrandAdmins()
    .then(function (res) {
      console.log(res.data);
      $scope.admins = res.data.admins;
    })
    .catch(function (err) {
      console.log(err);
    });

  // Emit the 'join' event to the server
  ChatService.emit("join", $scope.userId);

  ChatService.on("message", function (message) {
    $scope.$apply(function () {
      $scope.receivedMessages.push(message);
      // chatHistory.push(message);
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
        _id: loggedInUser.id,
        name: "Sarah",
        companyName: "DOCOMO",
      },
      receiver: {
        _id: $scope.receiver._id,
        username: $scope.receiver.username,
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
});
