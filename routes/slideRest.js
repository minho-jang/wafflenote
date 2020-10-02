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

// GET /slide/:noteid
router.get("/:noteid", (req, res, next) => {
  console.log("GET /slide/:noteid");

  Note.findOne(
    { note_id: req.params.noteid })
  .then((doc) => {
    res.send(doc.slide_list);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send(err)
  });
});

// POST /slide/:noteid
router.post("/:noteid", (req, res, next) => {
  console.log("POST /slide/:noteid");
  const newSlide = new Slide(req.body);

  Note.findOneAndUpdate(
    {note_id: req.params.noteid}, 
    {$push: {slide_list: newSlide}}, 
    {new: true})
  .then(doc => {
    res.send(doc);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err)
  });
});

// GET /slide/:slideid/thumbnail
router.get("/:slideid/thumbnail", (req, res, next) => {
  console.log("GET /slide/:slideid/thumbnail");

  Note.findOne(
    {"slide_list.slide_id": req.params.slideid })
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

  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

// GET /slide/:slideid/audio
router.get("/:slideid/audio", (req, res, next) => {
  console.log("GET /slide/:slideid/audio");
  
  Note.findOne(
    { "slide_list.slide_id": req.params.slideid })
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

  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

// POST /slide/:slideid/delete
router.post("/:slideid/delete", (req, res, next) => {
  console.log("POST /slide/:slideid/delete");
  
  Note.findOneAndUpdate(
    {"slide_list.slide_id": req.params.slideid },
    {$pull: {slide_list: {slide_id: req.params.slideid}}},
    {new: true})
  .then((doc) => {
    res.send(doc);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

// POST /slide/:slideid/replace
router.post("/:slideid/replace", (req, res, next) => {
  console.log("POST /slide/:slideid/replace");

  Note.findOneAndUpdate(
    {"slide_list.slide_id": req.params.slideid},
    {$set: {"slide_list.$[elem]": req.body}},
    {arrayFilters: [{"elem.slide_id": req.params.slideid}],
    new: true})
  .then((doc) => {
    res.send(doc);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});


module.exports = router;

