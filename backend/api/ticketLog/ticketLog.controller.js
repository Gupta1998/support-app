const TicketLog = require("../../models/ticketLog");

function createTicketLog(req, res) {
  const ticketLog = new TicketLog(req.body);
  ticketLog
    .save()
    .then(function (result) {
      if (result) {
        res.status(200).json({ success: true, ticketLog });
      }
      res.status(500).json({ success: true, ticketLog });
    })
    .catch(function (er) {
      console.log(er);
    });
}

module.exports = {
  createTicketLog,
};
