const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { default: Axios } = require("axios");

const router = express.Router();
const IMAGE_PROCESSING_SERVER_URL = "http://localhost:5000/image"

// multer setting
const frameUpload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10000000	// 10,000,000 Bytes = 10 MB
	},
	fileFilter(req, file, cb) {
		if (!file) {
			return cb(new Error("Must be image"))
		}
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("Must be png, jpg or jpeg"))
		}
		cb(undefined, true)
	}
});

// GET /api/frame
router.get("/", (req, res, next) => {
	res.status(200).send("You need to use POST method...");
});

// POST /api/frame
router.post("/", frameUpload.array("frameImg"), (req, res, next) => {
	if (!req.files[0] || !req.files[1]) {
		res.status(400).json({
			message: "No such file",
		});
		return;
	}
	
	console.log('[frameSender.js]: frame image info from client...');
	console.log(req.files);
	// Convert Buffer to String(Integer array)
	const bufToStr0 = Uint8Array.from(Buffer.from(req.files[0].buffer)).toString();
	const bufToStr1 = Uint8Array.from(Buffer.from(req.files[1].buffer)).toString();
	console.log('[frameSender.js]: string0 length: ', bufToStr0.length);
	console.log('[frameSender.js]: string1 length: ', bufToStr1.length);

	// 영상처리 API 요청.
	Axios({
		method: 'post',
		url: IMAGE_PROCESSING_SERVER_URL, 
		data: {
			frame0: bufToStr0,
			frame1: bufToStr1
		},
		maxContentLength: 50000000,
		maxBodyLength: 50000000
	})
	.then((response) => {
		console.log('[frameSender.js]: response status: ', response.status);
		console.log('[frameSender.js]: response data: ', response.data);
		res.status(200).json({
			result: response.data,
			message: "Image processing complete"
		});
	})
	.catch((error) => {
		if (error.response) {
			// 요청이 이루어졌으나 서버가 2xx의 범위를 벗어나는 상태 코드로 응답
			console.log(error.response.status);
			console.log(error.response.headers);
			console.error('[frameSender.js]: error code: ', error.code);
			console.error('[frameSender.js]: error response status: ', error.status);
			console.error('[frameSender.js]: error response data: ', error.response.data);
			res.status(400).json({
				message: "Image processing error",
				error: error.response.data
			});
		} else if (error.request) {
			// 요청이 이루어졌으나 응답을 받지 못함
			console.error('[frameSender.js]: error request: ', error.request);
			res.status(400).json({
				message: "Image processing error",
				error: "Request is good, but no response"
			});
		} else {
			// 요청 처리 중 에러 발생
			console.error('[frameSender.js]: error message: ', error.message);
			res.status(400).json({
				message: "Image processing error",
				error: "Error in request" 
			}); 
		}
	});

});

module.exports = router;
