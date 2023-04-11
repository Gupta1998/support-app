const mongoose = require("mongoose");

const ticketRequestSchema = new mongoose.Schema({
  from: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    username: {
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
  },
  ticket: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    ticketSubject: {
      type: String,
    },
    status: {
      type: String,
    },
    source: {
      type: String,
    },
    category: {
      type: String,
    },
    dueDateTime: {
      type: Date,
    },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  requestStatus: {
    type: String,
    default: "Pending",
  },
  recall: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("TicketRequest", ticketRequestSchema);
