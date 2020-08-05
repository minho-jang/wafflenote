const express = require("express");
const request = require("request");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// multer setting
// 파일 업로드 관리
// 만약 S3에 업로드해야 한다면 multer-s3 패키지를 고려한다.
const storage = multer.diskStorage({
	// 파일 저장 경로
	destination(req, file, cb) {
		cb(null, "api/tmp/frames/");
	},
	// 파일 저장 이름
	filename(req, file, cb) {
		cb(null, `${Date.now()}_frame${path.extname(file.originalname)}`);
	},
});
const frameUpload = multer({
	storage
});

// GET /api/frame
router.get("/", (req, res, next) => {
	res.status(204).send("You need to use POST method...");
});

// POST /api/frame
router.post("/", frameUpload.single("frameImg"), (req, res, next) => {
	if (!req.file) {
		res.status(400).json({
			message: "No such file",
		});
		return;
  }
	
	// 영상처리 API 요청.
	const options = {
		method: "POST",
		url: "http://localhost:8080",
		headers: {
			// "Authorization": "Basic " + auth,
			"Content-Type": "multipart/form-data",
		},
		formData: {
			image: fs.createReadStream(req.file.path),
		},
	};

	const call = function callImageProcessingApi(opts) {
		return new Promise((resolve, reject) => {
			request(opts, (err, res, body) => {
				if (err) reject(err);

				// TODO image processing logic

				resolve(body);
			});
		});
	}

	const wait = async function waitForResponse() {
		return await call(options);
	}

	wait().then((result) => {
		res.status(200).json({
			result,
			message: "Image processing completed"
		});
	})
	.catch((err) => {
		console.error(err);
		res.status(400).json({
			message: "Image processing error",
			error: err
		});
	});

});

module.exports = router;
