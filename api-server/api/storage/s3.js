const express = require("express");
const multer = require("multer");
const s3Tools = require("./s3Tools");
const fs = require("fs");

const router = express.Router();

// multer setting
const fileUpload = multer({
	storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + "/../tmp/");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)  // filename = "[Timestamp]_[OriginName]"
    }
  })
});

// GET /api/storage
router.get("/", (req, res, next) => {
  console.log("GET /api/storage");

  s3Tools.getBucketList()
  .then((result) => {
    console.log(result);
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
});

// POST /api/storage/upload
router.post("/upload", fileUpload.single("file"), (req, res, next) => {
  console.log("POST /api/storage/upload");
  if (!req.file) {
		res.status(400).send("No such file");
		return;
  }
  
  const tempFilePath = req.file.path; 
  s3Tools.uploadFile(tempFilePath)
  .then((key) => {
    // remove saved temporary file
    fs.unlink(tempFilePath, (err) => {
      if (err) {
        console.log(err);
      }
    });

    res.send({
      path: key
    });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
});

module.exports = router;
