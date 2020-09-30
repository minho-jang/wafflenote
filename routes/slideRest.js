const express = require("express");
const noteModel = require("../models/note");
const slideModel = require("../models/slide");
const s3Tools = require("../api/storage/s3Tools");

const Slide = slideModel.Slide;
const Note = noteModel.Note;
const router = express.Router();

// GET /sldie/:noteid
router.get("/:noteid", (req, res, next) => {
  console.log("GET /slide/:noteid");

  Note.findOne(
    { note_id: req.params.noteid })
  .then((doc) => {
    console.log(doc);
    res.send(doc.slide_list);
  })
  .catch((err) => res.status(500).send(err));
});

// POST /slide/:noteid
router.post("/:noteid", (req, res, next) => {
  console.log("POST /slide/:noteid");
  const newSlide = new Slide(req.body);
  const noteid = req.params.noteid;

  Note.findOneAndUpdate(
    {note_id: noteid}, 
    {$push: {slide_list: newSlide}}, 
    {new: true})
  .then(result => {
    console.log(result);
    res.send(result);
  })
  .catch(err => res.status(500).send(err));
});

// GET /slide/:noteid/:slideid/thumbnail
router.get("/:noteid/:slideid/thumbnail", (req, res, next) => {
  console.log("GET /slide/:noteid/:slideid/thumbnail");

  Note.findOne(
    { note_id: req.params.noteid })
  .then(doc => {
    console.log(doc);
    
    s3Tools.downloadFile(doc.thumbnail)
    .then((path) => {
      console.log(path);
      res.sendFile(path);
    }).catch(err => res.status(500).send(err));

  }).catch(err => res.status(500).send(err));
});

// GET /slide/:noteid/:slideid/audio
router.get("/:noteid/:slideid/audio", (req, res, next) => {
  console.log("GET /slide/:noteid/:slideid/audio");
  
  Note.findOne(
    { note_id: req.params.noteid })
  .select(
    { slide_list: {$elemMatch: {slide_id: req.params.slideid}} })
  .then(doc => {
    console.log(doc);
    s3Tools.downloadFile(doc.slide_list[0].audio)
    .then((path) => {
      console.log(path);
      res.sendFile(path);
    }).catch(err => res.status(500).send(err));

  }).catch(err => res.status(500).send(err));
});

// DELETE /slide/:noteid/:slideid
router.delete("/:noteid/:slideid", (req, res, next) => {
  console.log("DELETE /slide/:noteid/:slideid");
  
  Note.findOneAndUpdate(
    { note_id: req.params.noteid },
    {$pull: {slide_list: {slide_id: req.params.slideid}}})
  .then((result) => {
    console.log(result);
    res.send(result);
  })
  .catch(err => res.status(500).send(err))
})


module.exports = router;

