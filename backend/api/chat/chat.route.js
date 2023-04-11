module.exports = function (io) {
  const Chat = require("../../models/chat");
  const router = require("express").Router();

  io.on("connection", function (socket) {
    console.log("chat user connected");

    // Listen for the 'join' event
    socket.on("join", (userId) => {
      console.log(`chat User ${userId} joined`);
      socket.join(userId);
    });

    socket.on("message", function (message) {
      console.log("chat Message received:", message);
      io.to(message.receiver._id).emit("message", message);
      console.log("sent");
    });

    socket.on("chatSessionCompleted", function (data) {
      chatHistory = [];
    });

    // get previous chats
    router.get("/chats", function (req, res) {
      Chat.find(
        { "receiver._id": req.query.receiver, "sender._id": req.query.sender },
        function (err, chats) {
          if (err)
            res.status(500).json({ success: false, msg: "No chats found!" });
          else res.status(200).json(chats);
        }
      );
    });

    router.post("/chats", function (req, res) {
      const chat = new Chat(req.body);
      chat.save(function (err) {
        if (err) return res.status(500).json({ msg: "can not post!" });
        res.status(200).json(chat);
      });
    });

    //   socket.on("disconnect", function (message) {
    //     console.log("chat user disconnected", message);
    //   });

    socket.on("userLeft", function (data) {
      console.log(data);
    });
  });

  return router;
};
