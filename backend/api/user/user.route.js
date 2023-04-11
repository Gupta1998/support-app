const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const passport = require("passport");
const dotenv = require("dotenv");

const router = new express.Router();

const {
  loginUser,
  logoutUser,
  updateUserAvatar,
  updateUserById,
  createUser,
  getAllUsersExceptSuperAdmin,
  getBrandAdmins,
  getCreatedByUsers,
  getUserById,
  getUserDetail,
} = require("./user.controller");

const upload = multer({
  storage: multer.memoryStorage(),
});

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

router.get("/checkUser/:id", getUserById);

router.post("/login", loginUser);

router.post("/register", createUser);

// Protected Route
router.get("/brandAdmins/:id", getBrandAdmins);

router.get(
  "/users",
  passport.authenticate("jwt", { session: null }),
  getAllUsersExceptSuperAdmin
);

router.get("/userDetails/:id", getUserDetail);

router.get("/users/:id", getCreatedByUsers);

router.put("/users/avatar/:id", upload.single("image"), updateUserAvatar);

router.put("/user/:id", updateUserById);

router.post("/logout", logoutUser);

module.exports = router;
