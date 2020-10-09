const express = require("express");

const router = express.Router();

// GET /signout
router.get("/", (req, res, next) => {
  console.log("GET /signout");
  const sess = req.session;
  if (sess) {
    req.session.destroy();
    res.send({
      result: true
    });
  } else {
    res.status(400).send("Need to signin");
  }
  
});

module.exports = router;
