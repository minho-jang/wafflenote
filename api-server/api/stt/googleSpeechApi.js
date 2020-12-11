const express = require("express");
const multer = require("multer");

const s3Tools = require("../storage/s3Tools");
const textAnalysis = require("../nlp/textAnalysisFunc");
const gcs = require("../../api/storage/gcs");
const ObjectId = require("mongoose").Types.ObjectId;
const Note = require("../../models/note").Note;
const wafflenoteUtil = require("../../routes/wafflenote/util");

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
    return;
  }  
  
  const noteStatus = req.body.status;
  console.log(`status: ${noteStatus}`);
  if (noteStatus == "running" || noteStatus == "end") {     
    try {
      var t1 = Date.now();
      // const key = await s3Tools.uploadFileBuffer(req.file.buffer, `${Date.now()}_${req.file.originalname}`);  // upload to S3
      const key = await gcs.uploadBuffer(req.file.buffer, `${Date.now()}_${req.file.originalname}`);  // upload to gcs
      var t2 = Date.now();
      console.log(`mp3 file upload time : ${t2 - t1}ms`);
  
      // const script = await streamingRecognize(req.file.buffer, 'MP3', 48000, 'ko-KR');
      const script = await asyncRecognizeGCS(key, 'MP3', 48000, 'ko-KR');
      t1 = Date.now();
      console.log(`Google Speech API time : ${t1 - t2}ms`);
      
      const tags = await textAnalysis.getTags(script, 10);
      t2 = Date.now();
      console.log(`NLP keyword extraction time : ${t2 - t1}ms`);
  
      const slideListLength = await wafflenoteUtil.getSlideListLength(req.body.noteid);
      t1 = Date.now();
      console.log(`get slide id time : ${t1 - t2}ms`);


      let slideIdx;
      if (noteStatus == "running")  {
        slideIdx = slideListLength - 2;
        const slideObjectId = await wafflenoteUtil.getSlideIdByIndex(req.body.noteid, slideIdx); 
        const noteObjectId = new ObjectId(req.body.noteid);
        let doc = await Note.findByIdAndUpdate(
          noteObjectId,
          {$set: {
            "slide_list.$[elem].audio": key, 
            "slide_list.$[elem].tags": tags, 
            "slide_list.$[elem].script": script,
            "slide_list.$[elem].startTime": req.body.startTime,
            "slide_list.$[elem].endTime": req.body.endTime
          }},
          {arrayFilters: [{"elem._id": slideObjectId}], new: true}
        );

        t2 = Date.now();
        console.log(`update db document time : ${t2 - t1}ms`);

        res.send(doc);

      } else if (noteStatus == "end") { 
        slideIdx = slideListLength - 1;
        const slideObjectId = await wafflenoteUtil.getSlideIdByIndex(req.body.noteid, slideIdx); 
        const noteObjectId = new ObjectId(req.body.noteid);
        let doc = await Note.findByIdAndUpdate(
          noteObjectId,
          {$set: {
            status: "end",
            "slide_list.$[elem].audio": key, 
            "slide_list.$[elem].tags": tags, 
            "slide_list.$[elem].script": script,
            "slide_list.$[elem].startTime": req.body.startTime,
            "slide_list.$[elem].endTime": req.body.endTime
          }},
          {arrayFilters: [{"elem._id": slideObjectId}], new: true}
        );

        const text = await wafflenoteUtil.getNoteFullText(req.body.noteid);
        const numSummaries = slideListLength;

        const keywordResponse = await textAnalysis.getKeywords(text);
        const keywords = keywordResponse.data.keywords;

        const summaryResponse = await textAnalysis.getSummary(text, numSummaries);
        const summary = summaryResponse.data.summary;

	const num = 5;
	const keySentencesResponse = await textAnalysis.getKeySentences(text, num);
	const keySentences = keySentencesResponse.data.key_sentences;
        t2 = Date.now();
        console.log(`analysis of entire notes time : ${t2 - t1}ms`);
	
        doc = await Note.findByIdAndUpdate(
          noteObjectId,
          {$set: {
            summary: summary,
            note_keywords: keywords,
            key_sentences: keySentences
          }},
          {new: true}
        );
	
        t1 = Date.now();
        console.log(`update db document time : ${t1 - t2}ms`);

        res.send(doc); 
      } else {
        throw new Error(`Unknown note status: ${noteStatus}`);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(400).send("unknown status");
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

// Google Speech API 호출 (GCS)
const asyncRecognizeGCS = async (filename, encoding, sampleRateHertz, languageCode) => {
  const speech = require('@google-cloud/speech').v1p1beta1;
  const bucketName = require("../../config/gcs.json").BUCKET_NAME;

  // Creates a client
  const client = new speech.SpeechClient();

  const gcsUri = `gs://${bucketName}/${filename}`;
  const audio = {
    uri: gcsUri,
  };

  const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
      enableAutomaticPunctuation: true
    },
    audio: audio,
    interimResults: false, // If you want interim results, set this to true
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join(' ');

  return transcription;
}

module.exports = router;
