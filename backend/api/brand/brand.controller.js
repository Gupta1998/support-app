const Brand = require("../../models/brand");
const { uploadFile } = require("../../S3/s3");

function createBrand(req, res) {
  console.log("body: ", req.body);
  console.log("file: ", req.file);

  const { name, email, location, category, contactNo } = req.body;

  const obj = {
    name,
    email,
    location,
    category,
    contactNo,
  };
  if (req.file) {
    uploadFile(req.file)
      .then(function (data) {
        const brand = new Brand({
          ...req.body,
          logo: data.Location,
        });
        brand.save();
        return res.status(200).json({ success: true, brand });
      })
      .catch(function (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          msg: "Error adding brand logo. Please try again!",
        });
      });
  } else {
    const brand = new Brand(req.body);
    brand
      .save()
      .then(function (brand) {
        if (brand) {
          return res.status(200).json({ success: true, brand });
        }
      })
      .catch(function (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, msg: "Failed to create!" });
      });
  }
}

// function createBrand(req, res) {
//   const brand = new Brand(req.body);
//   brand.save();
//   res.json({ success: true, brand });
// }

function getAllBrands(req, res) {
  Brand.find()
    .then(function (brands) {
      if (brands) {
        res.json({ success: true, brands });
      } else {
        res.json({ Success: false, msg: "Could not find!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function updateBrand(req, res) {
  Brand.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(function (brand) {
      if (brand) {
        res.status(200).json({ success: true, brand });
      } else {
        res.status(500).json({ Success: false, msg: "Could not update!" });
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

module.exports = {
  createBrand,
  getAllBrands,
  updateBrand,
};
