const express = require("express");
const {
  createTicketRequest,
  getTicketRequestsOfUser,
} = require("./ticketRequest.controller");

const router = new express.Router();

router.get("/ticketrequests/:id", getTicketRequestsOfUser);
router.post("/ticketrequests", createTicketRequest);

module.exports = router;
