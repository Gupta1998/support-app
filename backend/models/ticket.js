const mongoose = require("mongoose");
const moment = require("moment");

const ticketSchema = new mongoose.Schema({
  owner: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },
    username: {
      type: String,
    },
  },
  assignedTo: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },
    username: {
      type: String,
    },
    isDisabled: {
      type: String,
    },
  },
  ticketRequest: {
    to: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
    },
    accepted: {
      type: Boolean,
    },
  },
  ticketNumber: {
    type: Number,
    default: Date.now(),
  },
  ticketSubject: {
    type: String,
    // required: true,
  },
  ticketDescription: {
    type: String,
  },
  source: {
    type: String,
    default: "Manual",
    // required: true,
  },
  status: {
    type: String,
    default: "Open",
  },
  priority: {
    type: String,
    default: "Medium",
  },
  reportedBy: {
    name: {
      type: String,
      // required: true,
    },
    companyName: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  attachment: {
    fileUrl: {
      type: String,
    },
  },
  category: {
    type: String,
    default: "Query",
  },
  dueDateTime: {
    type: Date,
    default: function () {
      let currentTime = new Date().getTime();
      let updatedTime = new Date(currentTime + 2 * 24 * 60 * 60 * 1000);
      return updatedTime;
    },
  },
  closedAt: {
    type: Date,
  },
  escalatedAt: {
    type: Date,
  },
  modifiedAt: {
    type: Date,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
