const express = require("express");
const request = require("request");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// multer setting
const frameUpload = multer({
	storage: multer.memoryStorage()
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
	
	console.log(req.file);
	
	const streamifier = require('streamifier');

	// 영상처리 API 요청.
	const options = {
		method: "POST",
		url: "http://localhost:8080",
		headers: {
			// "Authorization": "Basic " + auth,
			"Content-Type": "multipart/form-data",
		},
		formData: {
			image: streamifier.createReadStream(req.file.buffer)
		},
	};

	const call = function callImageProcessingApi(opts) {
		return new Promise((resolve, reject) => {
			request(opts, (err, res, body) => {
				if (err) reject(err);

				// TODO image processing call
				console.log(body);

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
