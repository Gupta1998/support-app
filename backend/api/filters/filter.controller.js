const { filter } = require("./filter.util");
const Ticket = require("../../models/ticket");

function ticketFilter(req, res, next) {
  const filterObj = req.body;

  filter(filterObj, Ticket)
    .then(function (result) {
      res.json({ success: true, result });
    })
    .catch(function (err) {
      console.log(err);
    });
}

module.exports = { ticketFilter };
