const mongoose = require("mongoose");
const moment = require("moment");

const notificationSchema = new mongoose.Schema({
  from: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    username: {
      type: String,
    },
    role: {
      type: String,
    },
  },
  to: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    username: {
      type: String,
    },
    role: {
      type: String,
    },
  },
  message: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
