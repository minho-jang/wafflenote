const express = require("express");
const noteModel = require("../models/note");
const slideModel = require("../models/slide");
const s3Tools = require("../api/storage/s3Tools");

const Slide = slideModel.Slide;
const Note = noteModel.Note;
const router = express.Router();

const mime = {
    jpg: 'image/jpeg',
    png: 'image/png',
    wav: 'audio/wav',
    mp3: 'audio/mpeg'
};
const fs = require("fs");
const path = require("path");

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
  .select(
    { slide_list: {$elemMatch: {slide_id: req.params.slideid}} })
  .then(doc => {
    s3Tools.downloadFile(doc.slide_list[0].thumbnail)
    .then((filepath) => {
      const type = mime[path.extname(filepath).slice(1)] || 'text/plain';
      fs.readFile(filepath, function(err, data) {
        if (err) {
          res.set('Content-Type', 'text/plain');
          res.status(404).end('Not found');
        }

        res.set('Content-type', type);
        res.end(data);
      });

    }).catch(err => {
      console.log(err);
      res.status(500).send(err);
    });

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
    s3Tools.downloadFile(doc.slide_list[0].audio)
    .then((filepath) => {
      const type = mime[path.extname(filepath).slice(1)] || 'text/plain';
      fs.readFile(filepath, function(err, data) {
        if (err) {
          res.set('Content-Type', 'text/plain');
          res.status(404).end('Not Found');
        }
      
        res.set('Content-type', type);
        res.end(data);
      });
    }).catch(err => {
      console.log(err);
      res.status(500).send(err);
    });

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

