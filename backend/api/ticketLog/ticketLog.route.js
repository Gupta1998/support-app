const express = require("express");
const router = new express.Router();

const { createTicketLog } = require("./ticketLog.controller");

router.post("/ticketLog", createTicketLog);

module.exports = router;
