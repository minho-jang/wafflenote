const express = require("express");

const router = express.Router();

// session check
router.use((req, res, next) => {
  if (req.url == "/signin" || req.url == "/signup" || req.url == "/find-id" || req.url == "/find-password") {
    next();
    
  } else if (! req.session.uuid) {
    res.status(400).send("Need to signin");

  } else {
    next();
  }
});

router.use("/signin", require("./signin"));
router.use("/signout", require("./signout"));
router.use("/signup", require("./signup"));

router.use("/check-google-token", require("./checkGoogleToken"));
router.use("/check-duplication", require("./checkDuplication"));

router.use("/find-id", require("./findId"));
router.use("/find-password", require("./findPassword"));
router.use("/change-password", require("./changePassword"));

router.use("/user-info", require("./userInfo"));

module.exports = router;

