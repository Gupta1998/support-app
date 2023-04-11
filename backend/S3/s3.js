const AWS = require("aws-sdk");

const dotenv = require("dotenv");

dotenv.config({ path: "../config/config.env" });

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

// UPLOAD FILE TO S3
function uploadFile(file) {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: file.originalname,
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise(); // this will upload file to S3
}

module.exports = {
  uploadFile,
};
