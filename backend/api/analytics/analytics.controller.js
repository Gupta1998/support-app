const Ticket = require("../../models/ticket");
const User = require("../../models/user");

function getTicketsCountByStatus(req, res) {
  Ticket.aggregate([
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}
function getTicketsCountBySource(req, res) {
  Ticket.aggregate([
    {
      $group: {
        _id: "$source",
        count: {
          $sum: 1,
        },
      },
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}
function getTicketsAssignedToEachUser(req, res) {
  Ticket.aggregate([
    {
      $match: { status: { $ne: "Closed" } },
    },
    {
      $group: {
        _id: "$assignedTo.username",
        ticketsAssigned: { $sum: 1 },
      },
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}
function getTicketsOfEachOwner(req, res) {
  Ticket.aggregate([
    {
      $group: {
        _id: "$owner.username",
        Ticket: { $push: "$_id" },
        ticketsCount: { $sum: 1 },
      },
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}
function getEachAgentTicketByStatus(req, res) {
  Ticket.aggregate([
    {
      $group: {
        _id: "$assignedTo.username",
        tickets: { $push: "$status" },
        count: { $sum: 1 },
      },
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function getTop3TicketAssignedUsers(req, res) {
  Ticket.aggregate([
    {
      $group: {
        _id: "$assignedTo.username",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "assignedTo.username": -1 },
    },
    {
      $limit: 3,
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function findAverageTimeSpentOnTicketByEachAgent(req, res) {
  Ticket.aggregate([
    {
      $addFields: {
        duration: {
          $dateDiff: {
            startDate: "$createdAt",
            endDate: "$closedAt",
            unit: "hour",
          },
        },
      },
    },
    {
      $group: {
        _id: "$assignedTo.username",
        total_duration: { $sum: "$duration" },
        ticket_count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        total_duration: 1,
        ticket_count: 1,
        avg_duration: { $divide: ["$total_duration", "$ticket_count"] },
      },
    },
    // {
    //   $addFields: {
    //     duration: {
    //       $divide: [{ $subtract: ["$modifiedAt", "$createdAt"] }, 1000],
    //     },
    //   },
    // },
    // {
    //   $group: {
    //     _id: "$assignedTo.username",
    //     total_duration: { $sum: "$duration" },
    //     ticket_count: { $sum: 1 },
    //   },
    // },
    // {
    //   $project: {
    //     _id: 1,
    //     total_duration: 1,
    //     ticket_count: 1,
    //     avg_duration: { $divide: ["$total_duration", "$ticket_count"] },
    //   },
    // },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function findTypeOfTicketEscalatedMost(req, res) {
  Ticket.aggregate([
    {
      $match: {
        status: "Escalated",
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function findAvgEscalationTime(req, res) {
  Ticket.aggregate([
    // {
    //   $match: {
    //     status: "Escalated",
    //   },
    // },
    // {
    //   $sort: {
    //     created_at: 1,
    //   },
    // },
    // {
    //   $group: {
    //     _id: "$status",
    //     avg_escalation_time: {
    //       $avg: { $subtract: ["$createdAt", "$modifedAt"] },
    //     },
    //   },
    // },
    {
      $match: { status: "Escalated" },
    },
    {
      $group: {
        _id: "$source",
        avg_escalation_time: {
          $avg: {
            $dateDiff: {
              startDate: "$createdAt",
              endDate: "$modifiedAt",
              unit: "hour",
            },
          },
        },
      },
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function findAvgClosingTime(req, res) {
  Ticket.aggregate([
    {
      $match: { status: "Closed" },
    },
    {
      $group: {
        _id: "$source",
        avg_closing_time: {
          $avg: {
            $dateDiff: {
              startDate: "$createdAt",
              endDate: "$closedAt",
              unit: "hour",
            },
          },
        },
      },
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function findTicketsPastDueDate(req, res) {
  Ticket.aggregate([
    {
      $match: {
        // status: { $in: ["Open", "Closed"] },
        dueDateTime: { $lt: new Date() },
      },
    },
    {
      $group: {
        _id: "$assignedTo.username",
        count: { $sum: 1 },
      },
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function findUsersEscalatedMostTickets(req, res) {
  Ticket.aggregate([
    {
      $match: {
        status: "Escalated",
      },
    },
    {
      $group: {
        _id: "$assignedTo.username",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: 3,
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function finsUsersClosedMostTickets(req, res) {
  Ticket.aggregate([
    {
      $match: {
        status: "Closed",
      },
    },
    {
      $group: {
        _id: "$assignedTo.username",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: 3,
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}

function searchText(req, res) {
  Ticket.aggregate([
    {
      $search: {
        moreLikeThis: {
          like: {
            ticketSubject: "test sub",
          },
        },
      },
    },
    // { $limit: 5 },
    {
      $project: {
        _id: 1,
        ticketSubject: 1,
        ticketDescription: 1,
      },
    },
  ])
    .then(function (result) {
      if (result) res.json({ success: true, result });
      else res.json({ success: false });
    })
    .catch(function (err) {
      console.log(err);
    });
}

module.exports = {
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
};
