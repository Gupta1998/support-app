const User = require("../../models/user");
const bcrypt = require("bcrypt");
const { issueJWT } = require("../../lib/utils");
const { uploadFile, getObjectSignedUrl } = require("../../S3/s3");

function getUserById(req, res) {
  User.findOne({ _id: req.params.id })
    .then(function (user) {
      Role.findOne({ _id: user.role }).then(function (role) {
        res.status(200).json(role);
      });
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function loginUser(req, res, next) {
  User.findOne({ username: req.body.username })
    .then(function (user) {
      const data = req.body.password;
      const hash = user.password;
      if (!user) {
        res.status(401).json({ success: false, msg: "could not find user!" });
      }
      bcrypt
        .compare(data, hash)
        .then(function (result) {
          if (result == true) {
            var token = issueJWT(user);
            res.status(200).json({
              user,
              success: true,
              token: token.token,
              expiresIn: token.expiresIn,
            });
          } else {
            res
              .status(401)
              .json({ success: false, msg: "Invalid credentials" });
          }
        })
        .catch(function (err) {
          console.log(err.message);
        });
    })
    .catch(function (err) {
      console.log(err.message);
    });
}

function createUser(req, res, next) {
  bcrypt.hash(req.body.password, 8, function (err, hash) {
    const user = new User({
      ...req.body,
      password: hash,
    });

    user
      .save()
      .then(function (user) {
        if (user) {
          const jwt = issueJWT(user);

          res.status(200).json({
            success: true,
            user: user,
            token: jwt.token,
            expiresIn: jwt.expiresIn,
          });
        } else {
          res.status(500).json({ success: false, msg: "Could not register" });
        }
      })
      .catch(function (err) {
        next(err.message);
      });
  });
}

function getBrandAdmins(req, res) {
  User.find({ "associatedWithBrand._id": req.params.id })
    .then(function (result) {
      if (result) {
        res.status(200).json({ success: true, admins: result });
      } else {
        res.status(404).json({ success: false, msg: "could not find" });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

function getAllUsersExceptSuperAdmin(req, res) {
  User.find({ username: { $ne: "Super_Admin" } })
    .then(function (users) {
      res.status(200).json({ success: true, users });
    })
    .catch(function (err) {
      res.status(404).json({ success: false });
    });
}

function updateUserById(req, res) {
  User.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(function (user) {
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(400).json({ success: false, msg: "could not update" });
      }
    })
    .catch(function (e) {
      console.log(e.message);
    });
}

function getUserDetail(req, res) {
  User.findById({ _id: req.params.id })
    .then(function (user) {
      if (user) res.status(200).json({ success: true, user });
      else {
        res.status(404).json({ success: false, msg: "could not find user!" });
      }
    })
    .catch(function (err) {
      console.log(err.message);
    });
}

function getCreatedByUsers(req, res) {
  User.find({
    "createdBy._id": req.params.id,
  })
    .then(function (users) {
      if (users) res.status(200).json({ success: true, users });
      else {
        res.status(400).json({ success: false, msg: "could not find!" });
      }
    })
    .catch(function (err) {
      console.log(err.message);
    });
}

async function updateUserAvatar(req, res) {
  const file = req.file;
  const imageName = generateFileName();
  // const fileBuffer = await sharp(file.buffer)
  //   .resize({ height: 1920, width: 1080, fit: "contain" })
  //   .toBuffer();
  const user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    { "avatar.imageName": imageName }
  );
  await uploadFile(file.buffer, imageName, file.mimetype);
  imageUrl = await getObjectSignedUrl(imageName);
  res.status(201).json({ success: true, imageUrl });
}

function logoutUser(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ success: true });
  });
}

module.exports = {
  loginUser,
  logoutUser,
  updateUserAvatar,
  updateUserById,
  createUser,
  getAllUsersExceptSuperAdmin,
  getBrandAdmins,
  getCreatedByUsers,
  getUserById,
  getUserDetail,
};
