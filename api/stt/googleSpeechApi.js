const express = require("express");
const multer = require("multer");
const axios = require("axios");

const s3Tools = require("../storage/s3Tools");
const noteModel = require("../../models/note");
const textAnalysis = require("../nlp/testAnalysisFunc");
const gcs = require("../../api/storage/gcs");

const NLP_SERVER_URL = require("../../config/endpoint.json").NLP_BASE_URL;
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
      const script = await streamingRecognizeGCS(key, 'MP3', 48000, 'ko-KR');
      t1 = Date.now();
      console.log(`Google Speech API time : ${t1 - t2}ms`);
      
      const tags = await getTags(script, 10);
      t2 = Date.now();
      console.log(`NLP keyword extraction time : ${t2 - t1}ms`);
  
      const slideListLength = await getSlideListLength(req.body.noteid);
      t1 = Date.now();
      console.log(`get slide id time : ${t1 - t2}ms`);


      let slideIdx;
      if (noteStatus == "running")  {
        slideIdx = slideListLength - 2;
        const slideObjectId = await getSlideIdByIndex(req.body.noteid, slideIdx); 
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
        res.send(doc);


      } else {  // noteStatus == "end"
        slideIdx = slideListLength - 1;
        const slideObjectId = await getSlideIdByIndex(req.body.noteid, slideIdx); 
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

        const text = await getNoteFullText(req.body.noteid);
        const numSummaries = slideListLength;

        const keywordResponse = await textAnalysis.getKeywords(text);
        const keywords = keywordResponse.data.keywords;

        const summaryResponse = await textAnalysis.getSummary(text, numSummaries);
        const summary = summaryResponse.data.summary;
        
        doc = await Note.findByIdAndUpdate(
          noteObjectId,
          {$set: {
            summary: summary,
            note_keywords: keywords
          }},
          {new: true}
        );

        res.send(doc); 
      }
      t2 = Date.now();
      console.log(`update db document time : ${t2 - t1}ms`);
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
const streamingRecognizeGCS = async (filename, encoding, sampleRateHertz, languageCode) => {
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
    .join('\n');
  console.log(`Transcription: ${transcription}`);

  return transcription;
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

const getSlideListLength = (noteid) => {
  return new Promise((resolve, reject) => {
    Note.aggregate([
      {$match: {_id: new ObjectId(noteid)}},
      {$project: {length: {$size: "$slide_list"}}}
    ])
    .then(result => {
      resolve(result[0].length);
    })
    .catch(err => {
      console.log(err);
      reject(err);
    });
  });
}

const getSlideIdByIndex = (noteid, idx) => {
  return new Promise((resolve, reject) => {
    Note.aggregate([
      {$match: {_id: new ObjectId(noteid)}},
      {$project: {theSlide: {$arrayElemAt: ['$slide_list', idx]}}}
    ])
    .then(result => {
      resolve(result[0].theSlide._id);
    })
    .catch(err => {
      console.log(err);
      reject(err);
    }); 
  });
}

const getNoteFullText = (noteid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Note.findById(noteid); 
      const slideList = doc.slide_list;
      let text = "";
      for (var i = 0; i < slideList.length; i++) {
        text = text.concat(slideList[i].script);
      }
      resolve(text);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}


module.exports = router;
