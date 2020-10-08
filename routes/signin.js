const express = require("express");
const userModel = require("../models/user");

const User = userModel.User;
const router = express.Router();

// POST /signin
router.post("/", async (req, res, next) => {
  console.log("POST /signin");

  const googleId = req.body.google_id;
  console.log(googleId);
  const sess = req.session;
  console.log(sess);

  try {
    const doc = await User.findOne(
      { google_id: googleId}
    );
    console.log(doc);
    if (doc && doc._id) {
      sess.wafflenote_id = doc._id;
      res.send("true");
    } else {
      res.send("false");
    }
    
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});


module.exports = router;
