const express = require("express");

const router = express.Router();

// session check
const whiteList = ["/signup", "/signin", "/find-id", "/find-password", "/verify-email", "/verify-code"];
router.use((req, res, next) => {
  if (whiteList.includes(req.url)) {
    next();
    
  } else if (! req.session.uuid) {
    res.status(401).send("Need to signin");

  } else {
    next();
  }
});

router.use("/", require("./verify"));

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

