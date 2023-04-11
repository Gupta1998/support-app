const moongose = require("mongoose");
const moment = require("moment");

const UserSchema = new moongose.Schema({
  associatedWithBrand: {},
  createdBy: {
    _id: {
      type: moongose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
    },
    role: {
      type: String,
    },
    brandLogo: {
      type: String,
    },
  },
  assignCount: {
    type: Number,
    default: 0,
  },
  rejectionCount: {
    type: Number,
    default: 0,
  },
  firstName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  contactNo: {
    type: Number,
    // max: 10,
  },
  password: {
    type: String,
    maxLnegth: 16,
    // required: true,
  },
  userType: {
    type: String,
  },
  role: {
    // type: moongose.Schema.Types.ObjectId,
    // ref: "Role",
    type: String,
    default: "Agent",
  },
  permissions: [
    {
      type: String,
    },
  ],
  avatar: {
    imageUrl: {
      type: String,
      default: undefined,
    },
  },
  status: {
    type: String,
    default: "Online",
  },
  isDisabled: {
    type: String,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const User = moongose.model("User", UserSchema);
module.exports = User;
