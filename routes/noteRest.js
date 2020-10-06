const express = require("express");
const multer = require("multer");
const fs = require("fs");

const noteModel = require("../models/note");
const slideModel = require("../models/slide");
const s3Tools = require("../api/storage/s3Tools");

const Note = noteModel.Note;
const Slide = slideModel.Slide;
const router = express.Router();

const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

// multer setting
const fileUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + "/../api/tmp/");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)  // filename = "[Timestamp]_[OriginName]"
    }
  })
});

// GET /note
router.get("/", (req, res, next) => {
  console.log("GET /note");
  
  const USERID = "TEMP_USERID";  // TODO get userid from session

  Note.find({author: USERID})
  .then((notes) => {
    res.send(notes);
  })
  .catch(err => res.status(500).send(err));
});

// GET /note/:noteid
router.get("/:noteid", (req, res, next) => {
  console.log("GET /note/:noteid");

  const noteObjectId = new ObjectId(req.params.noteid);
  Note.findById(req.params.noteid)
  .then((doc) => {
    res.send(doc);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

// POST /note
router.post("/", fileUpload.single("frameImg"), async (req, res, next) => {
  console.log("POST /note");
  
  if (!req.file) {
    res.status(400).send("No such file");
  }

  const USERID = "TEMP_USERID";  // TODO get userid from session
  
  try {
    const tempFilePath = req.file.path; 
    const smallImage = await s3Tools.imageResizeAndEncodeBase64(tempFilePath, 64, 64);
    const originImagePath = await s3Tools.uploadFile(tempFilePath);
    fs.unlink(tempFilePath, (err) => {
      if (err)  throw err;
    });
    
    const slideObject = {
      slide_id: 1,
      title: "슬라이드 1",
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
    const title = (req.body.title ? req.body.title : "Untitled");
    const noteObject = {
      author: USERID, 
      title: title, 
      slide_list: [newSlide]
    };
    const newNote = new Note(noteObject);
  
    const doc = await newNote.save();
    res.send(doc); 
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// POST /note/:noteid/title
router.post("/:noteid/title", (req, res, next) => {
  console.log("POST /note/:noteid/title");

  Note.findByIdAndUpdate(
    req.params.noteid, 
    {$set: {title: req.body.title}},
    {new: true})
  .then(doc => {
    res.send(doc);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

// POST /note/:noteid/delete
router.post("/:noteid/delete", (req, res, next) => {
  console.log("POST /note/:noteid/delete");

  const noteObjectId = new ObjectId(req.params.noteid);
  Note.deleteOne({_id: noteObjectId})
  .then((result) => {
    res.send(result);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

module.exports = router;
