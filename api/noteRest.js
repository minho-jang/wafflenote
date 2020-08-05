const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

// For parsing application/json
router.use(bodyParser.json());

// GET /note
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "'GET /note' has no action."
  });
});

// POST /note
router.post("/", (req, res, next) => {
  const username = req.body.username;
  const notename = req.body.notename;

  res.status(200).json({
    message: "Note is created.",
    noteid: `${username}_${notename}`,
    createdTime: Date.now(),
  });
});

module.exports = router;
