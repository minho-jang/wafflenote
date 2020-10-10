const express = require("express");

const router = express.Router();

router.use("/note", require("./noteRest"));
router.use("/slide", require("./slideRest"));

module.exports = router;

