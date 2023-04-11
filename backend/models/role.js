const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  permissions: [String],
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
