const TicketRequest = require("../../models/ticketRequest");
const async = require("async");

function getTicketRequestsOfUser(req, res) {
  const start = req.query.start ? req.query.start : 0;
  const limit = req.query.limit ? req.query.limit : 10;
  TicketRequest.countDocuments(function (err, count) {
    if (err) {
      return;
    }
    TicketRequest.find({ "to._id": req.params.id })
      .limit(limit)
      .skip(start)
      .then(function (data) {
        if (data) {
          res.json({ success: true, ticketRequests: data, count });
        } else {
          res.json({ success: false });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  });
}

function createTicketRequest(req, res) {
  const request = new TicketRequest(req.body);
  request
    .save()
    .then(function (data) {
      if (data) {
        res.json({ sucess: true, ticketRequest: request });
      } else {
        res.json({ success: false });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

module.exports = {
  createTicketRequest,
  getTicketRequestsOfUser,
};
