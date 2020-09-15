const express = require("express");

const router = express.Router();

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
