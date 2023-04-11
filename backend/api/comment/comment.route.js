const express = require("express");
const passport = require("passport");
const {
  getComments,
  createComment,
  getCommentsOfTicket,
} = require("./comment.controller");

const router = new express.Router();

router.get(
  "/comments",
  passport.authenticate("jwt", { session: null }),
  getComments
);
router.get(
  "/comments/:id/:ticketId",
  passport.authenticate("jwt", { session: null }),
  getCommentsOfTicket
);

router.post(
  "/comments",
  passport.authenticate("jwt", { session: null }),
  createComment
);

module.exports = router;
