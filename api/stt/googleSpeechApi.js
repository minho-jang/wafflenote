const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// multer setting
// 파일 업로드 관리
// 만약 S3에 업로드해야 한다면 multer-s3 패키지를 고려한다.
const storage = multer.diskStorage({
	// 파일 저장 경로
	destination(req, file, cb) {
		cb(null, "api/tmp/speech/");
	},
	// 파일 저장 이름
	filename(req, file, cb) {
		cb(null, `${Date.now()}_audio${path.extname(file.originalname)}`);
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
// 비동기식 스트리밍 방식
router.post("/", speechUpload.single("audio"), (req, res, next) => {
	if (!req.file) {
		res.status(400).json({
			message: "No such file",
		});
		return;
	}

	// Google Speech API 호출로 음성파일 전달.
	const filename = req.file.path;
	const encoding = 'LINEAR16';
	const sampleRateHertz = 16000;
	const languageCode = 'ko';

	// 즉시 실행 함수 표현(IIFE, Immediately Invoked Function Expression). 함수를 선언하고 바로 사용
	(async function streamingRecognize(
		filename,
		encoding,
		sampleRateHertz,
		languageCode
	) {
		const fs = require('fs');
		const speech = require('@google-cloud/speech');
	
		// Creates a client
		const client = new speech.SpeechClient();
	
		const request = {
			config: {
				encoding: encoding,
				sampleRateHertz: sampleRateHertz,
				languageCode: languageCode,
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
				// Stream an audio file from disk to the Speech API, e.g. "./resources/audio.raw"
				fs.createReadStream(filename).pipe(recognizeStream);
			})
		}

		return await call();
	})(filename, encoding, sampleRateHertz, languageCode)
	.then((transcription) => {
		res.status(200).json({
			transcription,
			message: "STT completed!",
			audioFile: req.file
		});
	}).catch((err) => {
		console.log(err);
		res.status(400).json({
			message: "Speech-to-Text error"
		})
	})

});

// 동기식 파일 전송 방식
// router.post("/", speechUpload.single("audio"), (req, res, next) => {
// 	if (!req.file) {
// 		res.status(400).json({
// 			message: "No such file",
// 		});
// 		return;
// 	}

// 	// Google Speech API 호출로 음성파일 전달.
// 	const filename = req.file.path;
// 	const encoding = 'LINEAR16';
// 	const sampleRateHertz = 16000;
// 	const languageCode = 'ko';

// 	// 즉시 실행 함수 표현(IIFE, Immediately Invoked Function Expression)
// 	(async function syncRecognizeGoogleSpeech(
// 		filename,
// 		encoding,
// 		sampleRateHertz,
// 		languageCode
// 	) {
// 		// Imports the Google Cloud client library
// 		const fs = require('fs');
// 		const speech = require('@google-cloud/speech');
	
// 		// Creates a client
// 		const client = new speech.SpeechClient();
	
// 		const config = {
// 			encoding: encoding,
// 			sampleRateHertz: sampleRateHertz,
// 			languageCode: languageCode,
// 		};
// 		const audio = {
// 			content: fs.readFileSync(filename).toString('base64'),
// 			// uri: "gs://wafflenote/STT_test_long.wav",
// 		};
	
// 		const request = {
// 			config: config,
// 			audio: audio,
// 		};

// 		// 짧은(1분 이하) 오디오 파일을 텍스트로 변환. 로컬 또는 원격 오디오 파일에서 동기 음성 인식을 수행한다.
// 		// Detects speech in the audio file
// 		// const [response] = await client.recognize(request);
// 		// const transcription = response.results
// 		// 	.map(result => result.alternatives[0].transcript)
// 		// 	.join('\n');
		
// 		// 긴 오디오 파일을 텍스트로 변환. 원격 오디오 파일에서 비동기 음성 인식을 수행한다.
// 		// 원격 오디오 파일은 GCS를 사용함을 의미하며, 해당 객체의 uri가 필요하다.
// 		// Detecrs speech in the audio file. This creates a recognition job that you can wait for now, or get its result later.
// 		const [operation] = await client.longRunningRecognize(request);
// 		// Get a Promise representation of the final result of the job
// 		const [response] = await operation.promise();
// 		const transcription = response.results
// 			.map(result => result.alternatives[0].transcript)
// 			.join('\n');
		
// 		return transcription;

// 	})(filename, encoding, sampleRateHertz, languageCode)
// 	.then((transcription) => {
// 		res.status(200).json({
// 			transcription,
// 			message: "STT completed!",
// 			audioFile: req.file
// 		});
// 	}).catch((err) => {
// 		console.log(err);
// 		res.status(400).json({
// 			message: "Speech-to-Text error"
// 		})
// 	})

// });

module.exports = router;
