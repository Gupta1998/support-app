const mongoose = require("mongoose");
const moment = require("moment");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
  },
  location: { type: String },
  category: {
    type: String,
    enum: [
      "fintech",
      "service_based",
      "product_based",
      "edtech",
      "SaaS",
      "food&beverages",
    ],
  },
  contactNo: { type: Number },
  logo: { type: String },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
