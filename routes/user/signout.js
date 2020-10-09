const express = require("express");

const router = express.Router();

// GET /signout
router.get("/signout", (req, res, next) => {
  req.session.destroy();
  res.send("true");
});

module.exports = router;
