const express = require("express");
const noteModel = require("../models/note");

const Note = noteModel.Note;
const router = express.Router();

const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

// GET /note
router.get("/", (req, res, next) => {
  console.log("GET /note");
  Note.find()
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
router.post("/", (req, res, next) => {
  console.log("POST /note");

  const note = new Note(req.body);
  note.save()
  .then(result => {
    res.send(result);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
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
