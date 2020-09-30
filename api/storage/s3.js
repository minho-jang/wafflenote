const express = require("express");
const multer = require("multer");
const s3Tools = require("./s3Tools");

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
    res.status(400).json({
			error: err,
		});
  });
});

// POST /api/storage/upload
router.post("/upload", fileUpload.single("file"), (req, res, next) => {
  console.log("POST /api/storage/upload");
  if (!req.file) {
		res.status(400).json({
			message: "No such file",
		});
		return;
  }
  
  s3Tools.uploadFile(req.file.path)
  .then((key) => {
    res.send({
      path: key
    })
  })
  .catch((err) => {
    console.log(err);
    res.status(err).json({
			error: err,
		});
  });
});

module.exports = router;
