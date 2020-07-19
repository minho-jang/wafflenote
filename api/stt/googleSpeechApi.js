const express = require("express");

const router = express.Router();

// multer setting
// 파일 업로드 관리
// 만약 S3에 업로드해야 한다면 multer-s3 패키지를 고려한다.
const multer = require("multer");

const storage = multer.diskStorage({
	// 파일 저장 경로
	destination(req, file, cb) {
		cb(null, "api/tmp/speech/");
	},
	// 파일 저장 이름
	filename(req, file, cb) {
		cb(null, new Date().valueOf() + path.extname(file.originalname));
	},
});
const speechUpload = multer({
	storage,
});

// GET /api/stt
router.get("/", (req, res, next) => {
	res.status(204).send("You need to use POST method...");
});

// POST /api/stt
router.post("/", speechUpload.single("frameImg"), (req, res, next) => {
	if (!req.file) {
		res.status(400).json({
			message: "No such file",
		});
		return;
	}

	// TODO Google Speech API 호출로 음성파일 전달.
	// await, async 필요

	// TODO API 호출 결과를 리턴. STT 결과

	res.status(200).json({
		message: "Speech data is arrived",
		file: req.file,
	});
});

module.exports = router;
