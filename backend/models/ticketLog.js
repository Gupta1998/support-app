const mongoose = require("mongoose");
const moment = require("moment");

const ticketLogSchema = new mongoose.Schema({
  ticket: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const TicketLog = mongoose.model("TicketLog", ticketLogSchema);

module.exports = TicketLog;
