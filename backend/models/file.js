const mongoose = require("mongoose");
const moment = require("moment");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
