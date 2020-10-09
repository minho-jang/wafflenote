const express = require("express");

const router = express.Router();

router.use("/signin", require("./signin"));
router.use("/signout", require("./signout"));
router.use("/signup", require("./signup"));

router.use("/check-google-token", require("./checkGoogleToken"));
router.use("/check-duplication", require("./checkDuplication"));

router.use("/find-id", require("./findId"));
router.use("/find-password", require("./findPassword"));

module.exports = router;
