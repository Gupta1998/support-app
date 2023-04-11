const mongoose = require("mongoose");
const moment = require("moment");

const commentSchema = new mongoose.Schema({
  commentedBy: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      // require: true,
    },
    username: {
      type: String,
    },
  },
  commentedOnticket: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },
    username: {
      type: String,
    },
  },
  comment: {
    type: String,
  },
  commentReason: {
    type: String,
    default: "Normal",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
