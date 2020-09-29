const express = require("express");
const multer = require("multer");
const s3Tools = require("./s3Tools");

const router = express.Router();

// multer setting
const fileUpload = multer({
	storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../tmp/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)  // filename = "[Timestamp]_[OriginName]"
    }
  })
});

// GET /api/storage
router.post("/", (req, res, next) => {
  console.log("GET /api/storage");
  const result = s3Tools.getBucketList();
  console.log(result);
  res.send(result);
})

// POST /api/storage/upload
router.post("/upload", fileUpload.single("file"), (req, res, next) => {
  console.log("POST /api/storage/upload");
  if (!req.file) {
		res.status(400).json({
			message: "No such file",
		});
		return;
  }
  
  s3Tools.uploadFile(req.file.filename);
})

module.exports = router;
