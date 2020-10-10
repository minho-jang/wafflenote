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

const IMAGE_PROCESSING_SERVER_URL = require("../../config/endpoint.json").IMAGE_PROCESSING_BASE_URL + "/image"

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

// POST /api/frame
router.post("/", frameUpload.array("frameImg"), async (req, res, next) => {
  console.log("POST /api/frame");

  if (!req.files[0] || !req.files[1]) {
    res.status(400).send("No such file");
  }
	
  // Convert Buffer to String(Integer array)
  const bufToStr0 = Uint8Array.from(Buffer.from(req.files[0].buffer)).toString();
  const bufToStr1 = Uint8Array.from(Buffer.from(req.files[1].buffer)).toString();

  try {
    // 영상처리 API 요청.
    const response = await axios({
      method: 'post',
      url: IMAGE_PROCESSING_SERVER_URL, 
      data: {
        frame0: bufToStr0,
        frame1: bufToStr1
      },
      maxContentLength: 50000000,  // about 50 MB
      maxBodyLength: 50000000  // about 50 MB
    });

    const nlpResult = response.data;
    if (nlpResult == 'False') {
      res.status(200).json({
        result: nlpResult
      });
    } else {
      console.log("Slide CHANGE!");
      // file upload to S3 
      const originImagePath = await s3Tools.uploadFileBuffer(req.files[1].buffer, `${Date.now()}_${req.files[1].originalname}`);
      // insert slide
      const slideid = await getLastSlideIdx(req.body.noteid) + 1; 
      const smallImage = await s3Tools.imageResizeAndEncodeBase64(req.files[1].buffer, 128, 128);
      const slideObject = {
        slide_id: slideid,
        title: `슬라이드 ${slideid}`,
        originImagePath: originImagePath,
        smallImage: smallImage, 
        audio: "",
        script: "",
        tags: [],
        memo: "",
        startTime: "",
        endTime: "",
      };
      const newSlide = new Slide(slideObject);
        
      const doc = await Note.findOneAndUpdate(
        {_id: new ObjectId(req.body.noteid)}, 
        {$push: {slide_list: newSlide}}, 
        {new: true});
      res.status(200).json({
        result: nlpResult,
        doc: doc
      });
    }
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

const getLastSlideIdx = (noteid) => {
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
