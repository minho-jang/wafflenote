const express = require("express");

const router = express.Router();

router.use("/frame", require("./imageProcessing/frameSender"));
router.use("/stt", require("./stt/googleSpeechApi"));
router.use("/nlp", require("./nlp/textAnalysis"))

router.get("/", (req, res, next) => {
	res.send("<h1>Hello api index page !</h1>");
});

module.exports = router;
