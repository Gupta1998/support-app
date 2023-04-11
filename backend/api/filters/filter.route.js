const router = require("express").Router();
const { ticketFilter } = require("./filter.controller");

router.put("/ticketFilter", ticketFilter);

module.exports = router;
