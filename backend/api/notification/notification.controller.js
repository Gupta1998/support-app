const Notification = require("../../models/notification");

function getNotificationsOfUser(req, res) {
  Notification.find(
    { "to._id": req.params.userId, read: false },
    function (err, notifications) {
      if (err) return res.status(500).send(err);
      res.status(200).json(notifications);
    }
  );
}

function createNotification(req, res) {
  var notification = new Notification({
    from: req.body.from,
    to: req.body.to,
    message: req.body.message,
  });
  notification.save(function (err) {
    if (err) return res.status(500).send(err);
    res.status(200).json(notification);
  });
}

function updateNotification(req, res) {
  Notification.findByIdAndUpdate(
    { _id: req.params.id },
    { read: true },
    // { new: true },
    (err, notification) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error marking notification as read");
      } else {
        res.status(200).json(notification);
      }
    }
  );
}

module.exports = {
  createNotification,
  getNotificationsOfUser,
  updateNotification,
};
