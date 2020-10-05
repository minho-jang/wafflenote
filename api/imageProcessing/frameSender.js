const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const axios = require("axios");

const noteModel = require("../../models/note");
const slideModel = require("../../models/slide");
const s3Tools = require("../storage/s3Tools");

const Note = noteModel.Note;
const Slide = slideModel.Slide;
const ObjectId = require("mongoose").Types.ObjectId;
const router = express.Router();

const IMAGE_PROCESSING_SERVER_URL = "http://localhost:5000/image";

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
  console.log("GET /api/frame");
  res.status(200).send("You need to use POST method...");
});

// POST /api/frame
router.post("/", frameUpload.array("frameImg"), (req, res, next) => {
  console.log("POST /api/frame");

  if (!req.files[0] || !req.files[1]) {
    res.status(400).send("No such file");
  }
	
  // Convert Buffer to String(Integer array)
  const bufToStr0 = Uint8Array.from(Buffer.from(req.files[0].buffer)).toString();
  const bufToStr1 = Uint8Array.from(Buffer.from(req.files[1].buffer)).toString();

  // 영상처리 API 요청.
  axios({
    method: 'post',
    url: IMAGE_PROCESSING_SERVER_URL, 
    data: {
      frame0: bufToStr0,
      frame1: bufToStr1
    },
    maxContentLength: 50000000,  // about 50 MB
    maxBodyLength: 50000000  // about 50 MB
  })
  .then((response) => {
    const nlpResult = response.data;
    if (nlpResult == 'False') {
      res.status(200).json({
        result: nlpResult
      });
    } else {
      console.log("Slide CHANGE!");
      // file upload to S3 
      s3Tools.uploadFileBuffer(req.files[1].buffer, `${Date.now()}_${req.files[1].originalname}`)
      .then(async (key) => {
        // insert slide
        const slideid = await getSlideListLength(req.body.noteid) + 1; 
        const slideObject = {
          slide_id: slideid,
          title: `슬라이드 ${slideid}`,
          originImagePath: key,
          smallImage: "",  // TODO image resize to 64x64 and encode base64
          audio: "",
          script: "",
          tags: [],
          memo: "",
          startTime: "",
          endTime: "",
        };
        const newSlide = new Slide(slideObject);
        
        Note.findOneAndUpdate(
          {_id: new ObjectId(req.body.noteid)}, 
          {$push: {slide_list: newSlide}}, 
          {new: true})
        .then(doc => {
          res.status(200).json({
            result: nlpResult
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send(err)
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });

});

const getSlideListLength = (noteid) => {
  return new Promise((resolve, reject) => {
    Note.aggregate([
      {$match: {_id: new ObjectId(noteid)}},
      {$project: {lastSlide: {$slice: ['$slide_list', -1]}}}
    ])
    .then(result => {
      resolve(result[0].lastSlide[0].slide_id);
    })
    .catch(err => {
      console.log(err);
      reject(err);
    }); 
  });
}


module.exports = router;
