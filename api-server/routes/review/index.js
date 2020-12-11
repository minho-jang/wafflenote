const express = require("express");

const router = express.Router();

// session check
router.use((req, res, next) => {
  // if (! req.session.uuid) {
  //   res.status(401).send("Need to signin");
  //  
  // } else {
  //   next();
  // }
  next();
});

router.use("/review", require("./reviewRest"));

module.exports = router;

