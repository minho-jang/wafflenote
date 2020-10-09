const express = require("express");

const User = require("../../models/user").User;
const router = express.Router();

// GET /user-info
router.get("/", async (req, res, next) => {
  console.log("GET /user-info");

  const uId = req.session.uuid;
  if (! uId) {
    res.status(400).send("Need to signin");
    return;
  }

  try {
    const doc = await User.findById(uId);
    res.send(doc);
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
