const express = require("express");
const userModel = require("../../models/user");
const crypto = require("crypto");

const User = userModel.User;
const router = express.Router();

// POST /signin
router.post("/", async (req, res, next) => {
  console.log("POST /signin");

  const type = req.body.type;
  const sess = req.session;

  if (type == "wafflenote") {
    try {
      const doc = await User.findOne(
        { wafflenote_id: req.body.wafflenote_id }
      );
      
      if (doc && doc._id) {
        const encryptedPw = crypto.pbkdf2Sync(req.body.password, doc.salt, 93034, 64, 'sha512');
        if (doc.password == encryptedPw) {
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
    try {
      const doc = await User.findOne(
        { google_id: req.body.google_id }
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


