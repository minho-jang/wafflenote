const express = require("express");
const Note = require("./models/note");

const router = express.Router();

// GET /note
router.get("/", (req, res, next) => {
  Note.find()
  .then((notes) => res.send(notes))
  .catch(err => res.status(500).send(err));
});

// POST /note
router.post("/", (req, res, next) => {
  const note = new Note(req.body);
  note.save()
  .then(note => res.send(note))
  .catch(err => res.status(500).send(err));
});

// PUT /note/:noteid
router.put("/:noteid", (req, res, next) => {
  const noteid = req.params.noteid;
  Note.findOneAndUpdate({ noteid }, req.body, { new: true })
  .then(note => res.send(note))
  .catch(err => res.status(500).send(err));
})

// DELETE /note/:noteid
router.delete("/:noteid", (req, res, next) => {
  const noteid = req.params.noteid;
  Note.remove({ noteid })
  .then(() => res.sendStatus(200))
  .catch(err => res.status(500).send(err))
})

module.exports = router;
