const express = require("express");

const router = express.Router();

// Session check
const webApi = ["/mypage", "/review", "/review/delete"];
const notRequireAuth = ["/signup", "/signin", "/find-id", "/find-password", "/change-password", "/verify-email", "/verify-code"];

const whiteList = webApi.concat(notRequireAuth);
router.use((req, res, next) => {
  if (whiteList.includes(req.url)) {
    next();
    
  } else if (! req.session.uuid) {
    res.status(401).send("Need to signin");

  } else {
    next();
  }
});

router.use("/", require("./user/index"));
router.use("/", require("./wafflenote/index"));
router.use("/", require("./review/index"));

module.exports = router;

