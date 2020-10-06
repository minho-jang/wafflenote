const express = require("express");
const path = require("path");
const { default: Axios } = require("axios");

const router = express.Router();

const NLP_SERVER_URL = "http://localhost:5001";

// POST /api/nlp/keyword-extraction
router.post("/keyword-extraction", (req, res, next) => {
  console.log("POST /api/nlp/keyword-extraction");
  const text = req.body.text;

  Axios({
    method: 'post',
    url: NLP_SERVER_URL + "keyword-extraction", 
    data: {
      text: text 
    },
  })
  .then((response) => {
    res.status(200).json({
      result: response.data,
    });
  })
  .catch((error) => {
    res.status(400).json({
      error: error
    });
  });
});

// POST /api/nlp/summarization
router.post("/summarization", (req, res, next) => {
  console.log("POST /api/nlp/summarization");
  const text = req.body.text;
  const numSummaries = req.body.num;

  Axios({
    method: 'post',
    url: NLP_SERVER_URL + "summarization", 
    data: {
      text: text,
      num: numSummaries
    },
  })
  .then((response) => {
    res.status(200).json({
      result: response.data,
    });
  })
  .catch((error) => {
    res.status(400).json({
      error: error
    });
  });
});

module.exports = router;
