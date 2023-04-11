module.exports = function (io) {
  const {
    createNotification,
    getNotificationsOfUser,
    updateNotification,
  } = require("./notification.controller");

  const router = require("express").Router();

  io.on("connection", (socket) => {
    // console.log("A user connected");

    // Listen for the 'join' event
    socket.on("join", (userId) => {
      // console.log(`User ${userId} joined`);
      socket.join(userId);
    });

    socket.on("notification", function (notification) {
      // console.log("Notification received:", notification);
      io.to(notification.to._id).emit("notification", notification);
    });

    // Get all notifications for a user
    router.get("/notifications/:userId", getNotificationsOfUser);

    // Store a new notification for a user
    router.post("/notifications", createNotification);

    // Mark a notification as read
    router.put("/api/notifications/:id", updateNotification);

    socket.on("disconnect", () => {
      // console.log("A user disconnected");
    });
  });

  return router;
};
