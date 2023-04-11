const express = require("express");
const router = new express.Router();
const {
  getTicketsCountByStatus,
  getTicketsCountBySource,
  getTicketsAssignedToEachUser,
  getTicketsOfEachOwner,
  getEachAgentTicketByStatus,
  getTop3TicketAssignedUsers,
  findAverageTimeSpentOnTicketByEachAgent,
  findTypeOfTicketEscalatedMost,
  findAvgEscalationTime,
  findAvgClosingTime,
  findTicketsPastDueDate,
  findUsersEscalatedMostTickets,
  finsUsersClosedMostTickets,
  searchText,
} = require("./analytics.controller");

router.get("/getTicketsCountByStatus", getTicketsCountByStatus);
router.get("/getTicketsCountBySource", getTicketsCountBySource);
router.get("/getTicketsAssignedToEachUser", getTicketsAssignedToEachUser);
router.get("/getTicketsOfEachOwner", getTicketsOfEachOwner);
router.get("/getEachAgentTicketByStatus", getEachAgentTicketByStatus);
router.get("/getTop3TicketAssignedUsers", getTop3TicketAssignedUsers);
router.get("/findTypeOfTicketEscalatedMost", findTypeOfTicketEscalatedMost);
router.get("/findAvgEscalationTime", findAvgEscalationTime);
router.get("/findAvgClosingTime", findAvgClosingTime);
router.get("/findTicketsPastDueDate", findTicketsPastDueDate);
router.get("/findUsersEscalatedMostTickets", findUsersEscalatedMostTickets);
router.get("/finsUsersClosedMostTickets", finsUsersClosedMostTickets);
router.get("/searchText", searchText);
router.get(
  "/findAverageTimeSpentOnTicketByEachAgent",
  findAverageTimeSpentOnTicketByEachAgent
);

module.exports = router;
