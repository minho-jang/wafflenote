const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

// POST json 데이터 수신
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

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
