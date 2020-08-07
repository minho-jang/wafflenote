const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// multer setting
const speechUpload = multer({
	storage: multer.memoryStorage(),
});

// GET /api/stt
router.get("/", (req, res, next) => {
	res.status(200).send("You need to use POST method...");
});

// POST /api/stt
// 비동기식 스트리밍 방식. Promise를 이용해서 스트리밍 STT 응답을 모두 기다린 후에 response를 보낸다.
router.post("/", speechUpload.single("audio"), (req, res, next) => {
	if (!req.file) {
		res.status(400).json({
			message: "No such file",
		});
		return;
	}

	// Google Speech API 호출로 음성파일 전달.
	const encoding = 'MP3';
	const sampleRateHertz = 48000;
	const languageCode = 'ko';

	// 즉시 실행 함수 표현(IIFE, Immediately Invoked Function Expression). 함수를 선언하고 바로 사용
	(async function streamingRecognize(
		encoding,
		sampleRateHertz,
		languageCode
	) {
		const streamifier = require('streamifier');
		const speech = require('@google-cloud/speech').v1p1beta1;
	
		// Creates a client
		const client = new speech.SpeechClient();
	
		const request = {
			config: {
				encoding: encoding,
				sampleRateHertz: sampleRateHertz,
				languageCode: languageCode,
				enableAutomaticPunctuation: true
			},
			interimResults: false, // If you want interim results, set this to true
		};
	
		const call = function callStreamingTranscript() {
			return new Promise((resolve, reject) => {
				let transcription = "";
				// Stream the audio to the Google Cloud Speech API
				const recognizeStream = client
				.streamingRecognize(request)
				.on('error', (err) => {
					console.error(err.message);
					reject();
				})
				.on('data', (data) => {
					console.log(data.results[0]);
					const trans = data.results[0].alternatives[0].transcript;
					transcription = transcription.concat(trans);
				})
				.on('end', () => {
					// 해당 오디오 데이터에 대한 STT가 완료된 후에 resolve하여 클라이언트에게 응답한다.
					console.log("Recognize END...");
					resolve(transcription);
				});

				// File data(in memory) To Stream
				streamifier.createReadStream(req.file.buffer).pipe(recognizeStream);
			})
		}

		return await call();
	})(encoding, sampleRateHertz, languageCode)
	.then((transcription) => {
		res.status(200).json({
			transcription,
			message: "STT completed!",
		});
	}).catch((err) => {
		console.log(err);
		res.status(400).json({
			message: "Speech-to-Text error",
			error: err,
		})
	})

});

module.exports = router;
