const express = require("express");
const path = require("path");
const { default: Axios } = require("axios");

const router = express.Router();

const NLP_SERVER_URL = "http://localhost:5001/";
const TAG = "[textAnalysis.js] "

// GET /api/nlp
router.get("/", (req, res, next) => {
	res.status(200).send("Natural Language Procssing");
});

// POST /api/nlp/keyword-extraction
router.post("/keyword-extraction", (req, res, next) => {
  const text = req.body.text;

  Axios({
		method: 'post',
		url: NLP_SERVER_URL + "keyword-extraction", 
		data: {
			text: text 
		},
	})
	.then((response) => {
		console.log(TAG + 'response status: ', response.status);
		console.log(TAG + 'response data: ', response.data);
		res.status(200).json({
			result: response.data,
			message: "Keyword extraction complete"
		});
	})
	.catch((error) => {
    res.status(400).json({
      message: "Keyword extraction error",
      error: error
    });
	});
});

// POST /api/nlp/summarization
router.post("/summarization", (req, res, next) => {
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
		console.log(TAG + 'response status: ', response.status);
		console.log(TAG + 'response data: ', response.data);
		res.status(200).json({
			result: response.data,
			message: "Summarization complete"
		});
	})
	.catch((error) => {
    res.status(400).json({
      message: "Summarization error",
      error: error
    });
	});
});

module.exports = router;
