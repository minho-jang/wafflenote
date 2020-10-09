const express = require("express");
const userModel = require("../models/user");

const User = userModel.User;
const router = express.Router();

// POST /signup
router.post("/", async (req, res, next) => {
  console.log("POST /signup");
  
  const googleId = req.body.google_id;
  console.log(googleId);
  const sess = req.session;
  console.log(sess);

  try {
    const doc = await User.findOne(
      { google_id: googleId }
    );
    if (doc && doc._id) {
      res.send("false");
    } else {
      const newUser = new User(req.body);
      const doc = await newUser.save();
      sess.wafflenote_id = doc._id;
      res.send("true");
    }
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});


module.exports = router;
