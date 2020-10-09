const express = require("express");
const noteModel = require("../../models/note");

const Note = noteModel.Note;
const router = express.Router();

// GET /check-duplication/:wafflenote_id
router.get("/check-duplication/:wafflenote_id", async (req, res, next) => {
  console.log("GET /check-duplication/:wafflenote_id");

  const wf_id = req.params.wafflenote_id;
  const doc = await Note.findOne( {wafflenote_id: wf_id } );
  if (doc && doc._id) {
    res.send("false");
  } else {
    res.send("true");
  }
});
