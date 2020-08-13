const express = require("express");
const request = require("request");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

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
	// Convert buffer data to integer array
	const bufToArr0 = Uint8Array.from(Buffer.from(req.files[0].buffer));
	const bufToArr1 = Uint8Array.from(Buffer.from(req.files[1].buffer));

	// 영상처리 API 요청.
	const options = {
		method: "POST",
		url: IMAGE_PROCESSING_SERVER_URL,
		headers: {
			"Content-Type": "multipart/form-data",
		},
		formData: {
			frame0: bufToArr0.toString(),
			frame1: bufToArr1.toString()
		},
	};

	const call = function callImageProcessingApi(opts) {
		return new Promise((resolve, reject) => {
			request(opts, (err, res, body) => {
				if (err) reject(err);

				// TODO After image processing call. 'body' is a result.
				console.log(body);

				resolve(body);
			});
		});
	}

	call(options).then((result) => {
		res.status(200).json({
			result,
			message: "Image processing complete!!"
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
