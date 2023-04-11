const Ticket = require("../../models/ticket");
const TicketLogs = require("../../models/ticketLog");
const User = require("../../models/user");
const { uploadFile } = require("../../S3/s3");
const conn = require("../../config/db");
const async = require("async");
const mongoose = require("mongoose");

function createTicket(req, res) {
  const {
    owner,
    reportedBy,
    source,
    priority,
    ticketSubject,
    ticketDescription,
  } = req.body;
  const ticketObj = {
    owner: JSON.parse(owner),
    reportedBy: JSON.parse(reportedBy),
    source,
    priority,
    ticketSubject,
    ticketDescription,
  };

  if (req.file) {
    uploadFile(req.file)
      .then(function (data) {
        const ticket = new Ticket({
          ...ticketObj,
          "attachment.fileUrl": data.Location,
        });
        ticket.save();
        res.status(200).json({ msg: "File uploaded successfully", ticket });
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error uploading file to S3");
      });
  } else {
    const ticket = new Ticket(ticketObj);
    ticket
      .save()
      .then(function (ticket) {
        if (ticket) {
          res.status(200).json({ success: true, ticket });
        }
      })
      .catch(function (err) {
        res.status(500).json({ success: false, msg: err.message });
      });
  }
}

function createNewTicket(req, res) {
  const ticket = new Ticket(req.body);
  ticket.save();
  res.status(200).json({ success: true, ticket });
}

function getAllTickets(req, res) {
  Ticket.find()
    .then(function (tickets) {
      if (tickets) {
        res.status(200).json({ success: true, tickets });
      } else {
        res
          .status(404)
          .json({ success: false, msg: "could not find tickets!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function getTicketlogs(req, res) {
  TicketLogs.find({ "ticket._id": req.params.id })
    .then(function (ticketLogs) {
      if (ticketLogs) {
        res.status(200).json({ success: true, ticketLogs });
      } else {
        res.status(404).json({ success: false, msg: "could not find!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function getTicketById(req, res) {
  Ticket.findOne({ _id: req.params.id, isDeleted: false })
    .then(function (ticket) {
      if (ticket) {
        res.status(200).json({ success: true, ticket });
      } else {
        res
          .status(404)
          .json({ success: false, msg: "could not find tickets!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function getTicketsOfAgent1(req, res) {
  Ticket.find({ "assignedTo._id": req.params.id }, { isDeleted: false })
    .then(function (tickets) {
      if (tickets) {
        const count = tickets.length;
        res.status(200).json({ success: true, tickets, count });
      } else {
        res.status(404).json({ success: false, msg: "error" });
      }
    })
    .catch(function (err) {
      console.log(err.message);
    });
}

function getCountOfAllAdminTickets(req, res) {
  Ticket.countDocuments({
    "owner._id": req.params.id,
    isDeleted: false,
  })
    .then(function (count) {
      if (count) {
        res.status(200).json({ success: true, count });
      } else {
        res
          .status(404)
          .json({ success: false, msg: "could not find tickets!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function getTicketsOfAdmin(req, res) {
  const start = req.query.start ? req.query.start : 0;
  const limit = req.query.limit ? req.query.limit : 10;
  // console.log(req.query.filterObj);

  // const filterObj = req.params.filterObj;
  // const reporterName = filterObj.reporterName ? filterObj.reporterName : "";
  // const reporterCompany = filterObj.reporterCompany
  //   ? filterObj.reporterCompany
  //   : "";
  // const agentName = filterObj.agentName ? filterObj.agentName : "";
  // const createdAtFrom = filterObj.createdAtFrom
  //   ? filterObj.createdAtFrom
  //   : new Date("2023, 01, 01");
  // const createdAtTo = filterObj.createdAtTo
  //   ? filterObj.createdAtTo
  //   : new Date();
  // const dueDateFrom = filterObj.dueDateFrom
  //   ? filterObj.dueDateFrom
  //   : new Date("2023, 01, 01");
  // const dueDateTo = filterObj.dueDateTo ? filterObj.dueDateTo : new Date();
  Ticket.find({
    "owner._id": req.params.id,
    isDeleted: false,
    // createdAt: {
    //   $gte: new Date(createdAtFrom),
    //   $lte: new Date(createdAtTo),
    // },
    // dueDateTime: {
    //   $gte: new Date(dueDateFrom),
    //   $lte: new Date(dueDateTo),
    // },
    // "reportedBy.name": {
    //   $regex: reporterName,
    //   $options: "i",
    // },
    // "assignedTo.username": {
    //   $regex: agentName,
    //   $options: "i",
    // },
  })
    .sort([["createdAt", -1]])
    .skip(start)
    .limit(limit)
    .then(function (tickets) {
      if (tickets) {
        res.status(200).json({ success: true, tickets });
      } else {
        res
          .status(404)
          .json({ success: false, msg: "could not find tickets!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function getTicketsOfAgent2(req, res) {
  const start = req.query.start ? req.query.start : 0;
  const limit = req.query.limit ? req.query.limit : 10;
  Ticket.countDocuments(
    { "assignedTo._id": req.params.id, isDeleted: false },
    function (err, count) {
      if (err) return;
      Ticket.find({
        "assignedTo._id": req.params.id,
        isDeleted: false,
      })
        .limit(limit)
        .skip(start)
        .then(function (tickets) {
          if (tickets) {
            res.status(200).json({ success: true, tickets, count });
          } else {
            res
              .status(404)
              .json({ success: false, msg: "could not find tickets!" });
          }
        })
        .catch(function (error) {
          console.log(error.message);
        });
    }
  );
}

function getTicketRequestsOfAgent(req, res) {
  Ticket.find({
    "ticketRequest.to": req.params.id,
    "ticketRequest.accepted": false,
    isDeleted: false,
  })
    .then(function (tickets) {
      if (tickets) {
        res.status(200).json({ success: true, tickets });
      } else {
        res
          .status(404)
          .json({ success: false, msg: "could not find tickets!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function updateTicketById(req, res) {
  mongoose.connection
    .startSession()
    .then(function (session) {
      session.startTransaction();

      async.waterfall(
        // tasks array for waterfall
        [
          function (callback) {
            Ticket.findByIdAndUpdate({ _id: req.params.id }, req.body, {
              session,
            })
              .then(function (ticket) {
                callback(null, ticket);
              })
              .catch(function (err) {
                // callback(err, null);
              });
          },
          function (ticket, callback) {
            // console.log("2 callback args", ticket);
            User.findOne({ _id: ticket.assignedTo._id }, null, { session })
              .then(function (user) {
                // console.log("User", user);
                callback(null, user);
              })
              .catch(function (err) {
                // console.log(err);
                // callback(err, null);
              });
          },
          function (user, callback) {
            // console.log("3 callback args" + user);
            let count = user.assignCount;
            let newCount = count + 1;
            User.findByIdAndUpdate(
              { _id: user._id },
              { assignCount: newCount },
              { session }
            )
              .then(function (user) {
                callback(null, user);
              })
              .catch(function (err) {
                // callback(err, null);
              });
          },
        ],
        // callback for waterfall
        function (err, result) {
          if (err) {
            session.abortTransaction();
            session.endSession();
            console.log("Something went wrong");
          } else {
            console.log("Final callback result", result);
            session
              .commitTransaction()
              .then(function () {
                session.endSession();
                res.json({ sucess: true, result });
              })
              .catch(function (err) {
                session.endSession();
                res.json({ success: false, msg: "Something went wrong" });
              });
          }
        }
      );
    })
    .catch(function (err) {
      console.log(err);
    });
}

function updateTicket(req, res) {
  Ticket.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(function (ticket) {
      if (ticket) {
        res.status(200).json({ success: true, ticket });
      } else {
        res.status(400).json({ success: false, msg: "could not update!" });
      }
    })
    .catch(function (err) {
      console.log(err.message);
    });
}

function updateTickets(req, res) {
  Ticket.updateMany({ status: "Escalated" }, { category: "Query" })
    .then(function (ticket) {
      if (ticket) {
        res.status(200).json({ success: true, ticket });
      } else {
        res.status(400).json({ success: false, msg: "could not update!" });
      }
    })
    .catch(function (err) {
      console.log(err.message);
    });
}

module.exports = {
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
};
