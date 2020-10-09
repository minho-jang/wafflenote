const express = require("express");
const userModel = require("../models/user");

const User = userModel.User;
const router = express.Router();

// POST /signup
router.post("/", async (req, res, next) => {
  console.log("POST /signup");
  
  const sess = req.session;
  const type = req.body.type;
  
  if (type == "wafflenote") {
    try {
      const wafflenoteId = req.body.wafflenote_id;
      const doc = await User.findOne(
        { wafflenote_id:  wafflenoteId }
      );
      if (doc && doc._id) {
        res.send("false");
      } else {
        const userObject = {
          wafflenote_id: wafflenoteId,
          name: req.body.name,
          phone_number: req.body.phone_number,
          note_list: [],
          agree: {
            privacy_policy: req.body.privacy_policy,
            terms_of_use: req.body.terms_of_use,
            advertise: req.body.advertise
          }
        };
        const newUser = new User(userObject);
        const doc = await newUser.save();
        sess.uuid = doc._id;
        res.send("true");
      }
    } catch(err) {
      console.log(err);
      res.status(500).send(err);
    }
    
  } else if (type == "google") {
    try {
      const googleId = req.body.google_id;
      const doc = await User.findOne(
        { google_id:  googleId }
      );
      if (doc && doc._id) {
        res.send("false");
      } else {
        const userObject = {
          google_id: googleId,
          name: req.body.name,
          phone_number: req.body.phone_number,
          note_list: [],
          agree: {
            privacy_policy: req.body.privacy_policy,
            terms_of_use: req.body.terms_of_use,
            advertise: req.body.advertise
          }
        };
        const newUser = new User(userObject);
        const doc = await newUser.save();
        sess.uuid = doc._id;
        res.send("true");
      }
    } catch(err) {
      console.log(err);
      res.status(500).send(err);
    }
    
  } else {
    res.status(400).send("Unknown type");
  }
});


module.exports = router;
