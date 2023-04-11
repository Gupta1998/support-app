const Comment = require("../../models/comment");

function getComments(req, res) {
  Comment.find()
    .then(function (comments) {
      if (comments) {
        res.status(200).json({ success: true, comments });
      } else {
        res
          .status(404)
          .json({ success: false, msg: "could not find comments!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function getCommentsOfTicket(req, res) {
  Comment.find({
    "commentedBy._id": req.params.id,
    "commentedOnticket._id": req.params.ticketId,
  })
    .then(function (comments) {
      if (comments) {
        res.status(200).json({ success: true, comments });
      } else {
        res
          .status(404)
          .json({ success: false, msg: "could not find comments!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function createComment(req, res) {
  const comment = new Comment(req.body);
  comment.save();
  res.status(200).json({ Success: true, comment });
}

module.exports = {
  getComments,
  createComment,
  getCommentsOfTicket,
};
