const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
  },
  sender: {
    _id: {
      type: String,
    },
    name: {
      type: String,
    },
    companyName: {
      type: String,
    },
  },
  receiver: {
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
  chat: {
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

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
