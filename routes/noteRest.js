const express = require("express");
const Note = require("../models/note");

const router = express.Router();

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
  const noteid = req.params.noteid;
  Note.find({ note_id: noteid })
  .then((notes) => {
    const note = notes.pop();
    res.send(note);
  })
  .catch(err => res.status(500).send(err));
});

// POST /note
router.post("/", (req, res, next) => {
  console.log("POST /note");
  const note = new Note(req.body);
  note.save()
  .then(result => {
    res.send(result);
  })
  .catch(err => res.status(500).send(err));
});

// PUT /note/:noteid
router.put("/:noteid", (req, res, next) => {
  console.log("PUT /note/:noteid");
  const noteid = req.params.noteid;
  Note.findOneAndUpdate({ note_id: noteid }, req.body, { new: true })
  .then(note => res.send(note))
  .catch(err => res.status(500).send(err));
})

// DELETE /note/:noteid
router.delete("/:noteid", (req, res, next) => {
  console.log("DELETE /note/:noteid");
  const noteid = req.params.noteid;
  Note.deleteOne({ noteid })
  .then(() => res.sendStatus(200))
  .catch(err => res.status(500).send(err))
})

module.exports = router;
