const express = require("express");
const multer = require("multer");
const { uploadFile, getAvatar } = require("./fileUpload.controller");

const router = new express.Router();

// const generateFileName = (bytes = 32) =>
//   crypto.randomBytes(bytes).toString("hex");

//  const fileBuffer = await sharp(file.buffer)
//     .resize({ height: 1920, width: 1080, fit: "contain" })
//     .toBuffer();

// Multer Filter
// const multerFilter = (req, file, cb) => {
//   if (
//     file.mimetype.split("/")[1] === "pdf" ||
//     file.mimetype.split("/")[1] === "doc" ||
//     file.mimetype.split("/")[1] === "docx"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Not a valid File Format!!"), false);
//   }
// };

//Calling the "multer" Function
const upload = multer({
  storage: multer.memoryStorage(),
  // fileFilter: multerFilter,
});

router.post("/upload", upload.single("myFile"), uploadFile);

router.put("/avatar/:id", upload.single("avatar"), getAvatar);

module.exports = router;
