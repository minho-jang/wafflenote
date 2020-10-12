const express = require("express");
const userModel = require("../../models/user");

const User = userModel.User;
const router = express.Router();

// POST /signin
router.post("/", async (req, res, next) => {
  console.log("POST /signin");

  const type = req.body.type;
  const sess = req.session;

  if (type == "wafflenote") {
    const wafflenoteId = req.body.wafflenote_id;
    const password = req.body.password;
    try {
      const doc = await User.findOne(
        { wafflenote_id: wafflenoteId, password: password }
      );
      if (doc && doc._id) {
        sess.uuid = doc._id;
        res.send({
          result: true,
          whoami: doc.name
        });
      } else {
        res.send({
          result: false
        });
      }
      
    } catch(err) {
      console.log(err);
      res.status(500).send(err);
    }

  } else if (type == "google") {
    const googleId = req.body.google_id;
    try {
      const doc = await User.findOne(
        { google_id: googleId }
      );
      if (doc && doc._id) {
        sess.uuid = doc._id;
        res.send({
          result: true,
          whoami: doc.name
        });
      } else {
        res.send({
          result: false
        });
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
