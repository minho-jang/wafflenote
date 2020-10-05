const express = require("express");
const multer = require("multer");
const axios = require("axios");

const s3Tools = require("../storage/s3Tools");
const noteModel = require("../../models/note");
const NLP_SERVER_URL = "http://localhost:5001";

const ObjectId = require("mongoose").Types.ObjectId;
const Note = noteModel.Note;
const router = express.Router();

// multer setting
const speechUpload = multer({
  storage: multer.memoryStorage(),
});

// POST /api/stt
router.post("/", speechUpload.single("audio"), async (req, res, next) => {
  console.log("POST /api/stt");

  if (!req.file) {
    res.status(400).send("No such file");
  }  
  
  try {
    var t1 = Date.now();
    const key = await s3Tools.uploadFileBuffer(req.file.buffer, `${Date.now()}_${req.file.originalname}`);  // upload to S3
    var t2 = Date.now();
    console.log(`mp3 file upload time : ${t2 - t1}ms`);

    const script = await streamingRecognize(req.file.buffer, 'MP3', 48000, 'ko-KR');
    t1 = Date.now();
    console.log(`Google Speech API time : ${t1 - t2}ms`);
    
    const tags = await getTags(script, 10);
    t2 = Date.now();
    console.log(`NLP keyword extraction time : ${t2 - t1}ms`);

    const slideObjectId = new ObjectId(req.body.slideid);
    const doc = await Note.findOneAndUpdate(
      {"slide_list._id": slideObjectId},
      {$set: {
        "slide_list.$[elem].audio": key, 
        "slide_list.$[elem].tags": tags, 
        "slide_list.$[elem].script": script,
        "slide_list.$[elem].startTime": req.body.startTime,
        "slide_list.$[elem].endTime": req.body.endTime
      }},
      {arrayFilters: [{"elem._id": slideObjectId}], new: true}
    );
    t1 = Date.now();
    console.log(`update db document time : ${t1 - t2}ms`);

    res.send(doc);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Google Speech API 호출
const streamingRecognize = (buffer, encoding, sampleRateHertz, languageCode) => {
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

  return new Promise((resolve, reject) => {
    let transcription = "";

    // Stream the audio to the Google Cloud Speech API
    const recognizeStream = client
      .streamingRecognize(request)
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('data', (data) => {
        const trans = data.results[0].alternatives[0].transcript;
        transcription = transcription.concat(trans);
      })
      .on('end', () => {
        resolve(transcription);
      });
    // File data(in memory) to Stream
    streamifier.createReadStream(buffer).pipe(recognizeStream);
  });  
}

// NLP API 호출
const getTags = (text, num) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: NLP_SERVER_URL + "/keyword-extraction", 
      data: {
        text 
      },
    })
    .then((response) => {
      let tags = [];
      const result = response.data.keywords;
      const count = (result.length > num ? num : result.length);
      for (var i = 0; i < count; i++) {
        tags.push(result[i][0]);
      }
      
      resolve(tags.slice(0, count));
    })
    .catch(err => {
      console.log(err);
      reject(err);
    });
  });
}


module.exports = router;
