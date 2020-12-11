const express = require("express");

const router = express.Router();

// GET /signout
router.get("/", (req, res, next) => {
  console.log("GET /signout");
  const sess = req.session;

  req.session.destroy();
  res.clearCookie("connect.sid");
  res.send({
    result: true
  });
  
});

module.exports = router;
