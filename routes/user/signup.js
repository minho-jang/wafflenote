const express = require("express");
const userModel = require("../../models/user");
const crypto = require("crypto");

const User = userModel.User;
const router = express.Router();

// POST /signup
router.post("/", async (req, res, next) => {
  console.log("POST /signup");
  
  const type = req.body.type;

  if (type == "wafflenote") {
    try {
      const salt = crypto.randomBytes(64).toString('base64');
      const encryptedPw = crypto.pbkdf2Sync(req.body.password, salt, 93034, 64, 'sha512');

      const wafflenoteId = req.body.wafflenote_id;
      const doc = await User.findOne(
        { wafflenote_id:  wafflenoteId }
      );
      if (doc && doc._id) {
        res.send({
          result: false
        });
      } else {
        const userObject = {
          wafflenote_id: wafflenoteId,
          password: encryptedPw,
          name: req.body.name,
          phone_number: req.body.phone_number,
          note_list: [],
          agree: {
            privacy_policy: req.body.agree.privacy_policy,
            terms_of_use: req.body.agree.terms_of_use,
            advertise_sms: req.body.agree.advertise_sms,
            advertise_email: req.body.agree.advertise_email
          },
          salt: salt
        };
        const newUser = new User(userObject);
        const doc = await newUser.save();
        res.send({
          result: true
        });
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
        res.send({
          result: false
        });
      } else {
        const userObject = {
          google_id: googleId,
          name: req.body.name,
          phone_number: req.body.phone_number,
          note_list: [],
          agree: {
            privacy_policy: req.body.agree.privacy_policy,
            terms_of_use: req.body.agree.terms_of_use,
            advertise_sms: req.body.agree.advertise_sms,
            advertise_email: req.body.agree.advertise_email
          }
        };
        const newUser = new User(userObject);
        const doc = await newUser.save();
        res.send({
          result: true
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
