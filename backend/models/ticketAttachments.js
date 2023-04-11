const mongoose = require("mongoose");
const moment = require("moment");

const attachmentSchema = new mongoose.Schema({
  attachmentForTicket: {
    _id: mongoose.Schema.Types.ObjectId,
  },
  fileName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Attachment = mongoose.model("Attachment", attachmentSchema);
module.exports = Attachment;
