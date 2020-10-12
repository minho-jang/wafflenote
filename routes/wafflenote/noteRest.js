const express = require("express");
const multer = require("multer");
const fs = require("fs");

const noteModel = require("../../models/note");
const slideModel = require("../../models/slide");
const userModel = require("../../models/user");
const s3Tools = require("../../api/storage/s3Tools");

const Note = noteModel.Note;
const Slide = slideModel.Slide;
const User = userModel.User;
const router = express.Router();

const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

// multer setting
const fileUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + "/../../api/tmp/");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)  // filename = "[Timestamp]_[OriginName]"
    }
  })
});

// GET /note
router.get("/", (req, res, next) => {
  console.log("GET /note");
  
  const sess = req.session;
  Note.find({ author: sess.uuid })
  .sort({createdAt: -1})
  .then((notes) => {
    res.send(notes);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

// GET /note/recently
router.get("/recently", (req, res, next) => {
  console.log("GET /note/recently");

  const sess = req.session;
  Note.find({ author: sess.uuid })
  .sort({createdAt: -1})
  .limit(1)
  .then((doc) => {
    res.send(doc); 
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
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
  
  const sess = req.session;

  try {
    const tempFilePath = req.file.path; 
    const smallImage = await s3Tools.imageResizeAndEncodeBase64(tempFilePath);
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
      author: sess.uuid, 
      title: title, 
      status: "running",
      slide_list: [newSlide]
    };
    const newNote = new Note(noteObject);  
    const docNewNote = await newNote.save();

    // After create note, Add obejct id to user.note_list
    const doc = await User.findByIdAndUpdate(
      sess.uuid,
      {$push: {note_list: docNewNote._id}},
      {new: true}
    );

    res.send(docNewNote); 
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

// GET /note/:noteid/result
router.get("/:noteid/result", async (req, res, next) => {
  console.log("GET /note/:noteid/result");

  try {
    const doc = await Note.findById(req.params.noteid)
    res.send({
      keywords: doc.note_keywords,
      summary: doc.summary
    });
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;

