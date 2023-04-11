const Ticket = require("../../models/ticket");
const User = require("../../models/user");

function uploadFile(req, res) {
  s3.uploadFile(req.file)
    .then(function (data) {
      console.log(`File uploaded successfully. ${data.Location}`);
      const ticket = new Ticket({
        ...req.body,
        "attachment.fileUrl": data.Location,
      });
      ticket.save();
      res.status(200).json({ msg: "File uploaded successfully", ticket });
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error uploading file to S3");
    });
}

function getAvatar(req, res) {
  const file = {
    // Get the uploaded file buffer from the request object
    buffer: req.file.buffer,
    // Set the key (file name) under which to store the image
    filename: `profile-photos/${req.file.originalname}`,
    mimetype: req.file.mimetype,
  };

  // Upload the image to S3
  s3.uploadFile(file)
    .then(function (data) {
      console.log(`Image uploaded successfully. URL: ${data.Location}`);
      User.findByIdAndUpdate(
        { _id: req.params.id },
        { ...req.body, "avatar.imageUrl": data.Location }
      )
        .then(function (user) {
          if (user) {
            res.status(200).json({ success: true, user });
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    })
    .catch(function (err) {
      console.log(`Error uploading image to S3: ${err}`);
      res.status(500).send("Error uploading image");
    });
}

module.exports = {
  uploadFile,
  getAvatar,
};
