const express = require("express");

const router = express.Router();

router.use("/frame", require("./imageProcessing/slideRecognition"));
router.use("/stt", require("./stt/googleSpeechApi"));

router.get("/", (req, res, next) => {
	res.send("<h1>Hello api index page !</h1>");
});

module.exports = router;
