const express = require("express");
const router = new express.Router();
const multer = require("multer");

const {
  createTicket,
  createNewTicket,
  updateTicketById,
  updateTickets,
  updateTicket,
  getAllTickets,
  getTicketById,
  getTicketsOfAdmin,
  getCountOfAllAdminTickets,
  getTicketsOfAgent1,
  getTicketsOfAgent2,
  getTicketRequestsOfAgent,
  getTicketlogs,
} = require("./ticket.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  // fileFilter: multerFilter,
});

router.post("/tickets", upload.single("myFile"), createTicket);

router.post("/newtickets", createNewTicket);

router.get("/tickets", getAllTickets);

router.get("/tickets/:id", getTicketById);

router.get("/tickets/agentTickets/:id", getTicketsOfAgent1);

router.get("/tickets/admin/:id", getTicketsOfAdmin);

router.get("/tickets/admin/count/:id", getCountOfAllAdminTickets);

router.get("/tickets/agent/:id", getTicketsOfAgent2);

router.get("/tickets/requests/:id", getTicketRequestsOfAgent);

router.get("/tickets/logs/:id", getTicketlogs);

router.put("/tickets/:id", updateTicket);

router.put("/updateTickets", updateTickets);

module.exports = router;
