const express = require("express");
const Role = require("../../models/role");

const router = new express.Router();

router.post("/role", function (req, res) {
  const role = new Role(req.body);
  role.save();
  res.json({ success: true, role });
});

router.get("/roles", function (req, res) {
  Role.find()
    .then(function (roles) {
      if (roles) {
        res.json({ success: true, roles });
      } else {
        res.json({ sucess: false, msg: "Could not get Roles!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
});

module.exports = router;
