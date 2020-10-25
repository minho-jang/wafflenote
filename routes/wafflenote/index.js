const express = require("express");

const router = express.Router();

// session check
router.use((req, res, next) => {
  if (! req.session.uuid) {
    res.status(401).send("Need to signin");
    
  } else {
    req.session.touch();
    next();
  }
});

router.use("/note", require("./noteRest"));
router.use("/slide", require("./slideRest"));

module.exports = router;

