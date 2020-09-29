const express = require("express");
const Note = require("../models/note");
const slideModel = require("../models/slide");

const router = express.Router();

// POST /slide/:noteid
router.post("/:noteid", (req, res, next) => {
  console.log("POST /slide/:noteid");
  const newSlide = new slideModel.Slide(req.body);
  const noteid = req.params.noteid;
  Note.findOneAndUpdate({note_id: noteid}, {$push: {slide_list: newSlide}}, {new: true})
  .then(result => {
    res.send(result);
  })
  .catch(err => res.status(500).send(err));
});

module.exports = router;

