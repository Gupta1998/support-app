const express = require("express");
const router = new express.Router();

const multer = require("multer");

const {
  createBrand,
  getAllBrands,
  updateBrand,
} = require("./brand.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  // fileFilter: multerFilter,
});

router.post("/brands", upload.single("myFile"), createBrand);

router.get("/brands", getAllBrands);

router.put("/brands/:id", updateBrand);

module.exports = router;
