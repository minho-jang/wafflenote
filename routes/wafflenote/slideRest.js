const express = require("express");
const noteModel = require("../../models/note");
const slideModel = require("../../models/slide");
const s3Tools = require("../../api/storage/s3Tools");
const gcs = require("../../api/storage/gcs");
const textAnalysis = require("../../api/nlp/textAnalysisFunc");

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

const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

// GET /slide/all/:noteid
router.get("/all/:noteid", (req, res, next) => {
  console.log("GET /slide/all/:noteid");

  Note.findById(req.params.noteid)
  .then((doc) => {
    if (doc && doc._id) {
      res.send(doc.slide_list);
    } else {
      res.send("No such note");
      return;
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send(err)
  });
});

// GET /slide/:slideid
router.get("/:slideid", (req, res, next) => {
  console.log("GET /slide/:slideid");

  const slideObjectId = new ObjectId(req.params.slideid);
  Note.findOne(
    {"slide_list._id": slideObjectId})
  .select(
    { slide_list: {$elemMatch: {_id: slideObjectId}} })
  .then(doc => {
    res.send(doc.slide_list[0]);
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

// POST /slide/:noteid
router.post("/:noteid", (req, res, next) => {
  console.log("POST /slide/:noteid");
  const newSlide = new Slide(req.body);

  Note.findOneAndUpdate(
    {_id: new ObjectId(req.params.noteid)}, 
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

// GET /slide/:slideid/origin-image
router.get("/:slideid/origin-image", (req, res, next) => {
  console.log("GET /slide/:slideid/origin-image");

  const slideObjectId = new ObjectId(req.params.slideid);
  Note.findOne(
    {"slide_list._id": slideObjectId})
  .select(
    { slide_list: {$elemMatch: {_id: slideObjectId}} })
  .then(doc => {
    // s3Tools.downloadFile(doc.slide_list[0].originImagePath)
    gcs.download(doc.slide_list[0].originImagePath)
    .then((filepath) => {
      const type = mime[path.extname(filepath).slice(1)] || 'text/plain';
      fs.readFile(filepath, (err, data) => {
        if (err) {
          throw err;
        }

        // remove saved temporary file
        fs.unlink(filepath, (err) => {
          if (err)  throw err;
        });

        res.set('Content-type', type);
        res.end(data);
      });

    }).catch((err) => {
      throw err;
    });

  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

// GET /slide/:slideid/audio
router.get("/:slideid/audio", (req, res, next) => {
  console.log("GET /slide/:slideid/audio");

  const slideObjectId = new ObjectId(req.params.slideid);
  Note.findOne(
    { "slide_list._id": slideObjectId })
  .select(
    { slide_list: {$elemMatch: {_id: slideObjectId}} })
  .then(doc => {
    // s3Tools.downloadFile(doc.slide_list[0].audio)
    gcs.download(doc.slide_list[0].audio)
    .then((filepath) => {
      const type = mime[path.extname(filepath).slice(1)] || 'text/plain';
      fs.readFile(filepath, (err, data) => {
        if (err) {
          throw err;
        }

        // remove saved temporary file
        fs.unlink(filepath, (err) => {
          if (err) {
            throw err;
          }
        });
      
        res.set('Content-type', type);
        res.end(data);
      });
    }).catch(err => {
      throw err;
    });

  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

// POST /slide/:slideid/delete
router.post("/:slideid/delete", (req, res, next) => {
  console.log("POST /slide/:slideid/delete");
  
  const slideObjectId = new ObjectId(req.params.slideid);
  Note.findOneAndUpdate(
    {"slide_list._id": slideObjectId },
    {$pull: {slide_list: {_id: slideObjectId}}},
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
router.post("/:slideid/replace", async (req, res, next) => {
  console.log("POST /slide/:slideid/replace");

  try {
    const tags = await textAnalysis.getTags(req.body.script, 10);
    req.body.tags = tags;

    const slideObjectId = new ObjectId(req.params.slideid);
    const doc = await Note.findOneAndUpdate(
      {"slide_list._id": slideObjectId},
      {$set: {"slide_list.$[elem]": req.body}},
      {arrayFilters: [{"elem._id": slideObjectId}],
      new: true});
    res.send(doc);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});


module.exports = router;

