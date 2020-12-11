const express = require("express");

const User = require("../../models/user").User;
const router = express.Router();

// POST /find-id
router.post("/", async (req, res, next) => {
  console.log("POST /find-id");

  const uName = req.body.name;
  const uPhone = req.body.phone_number;
  
  try {
    const doc = await User.findOne({ name: uName, phone_number: uPhone });
    if (doc && doc._id) {
      if (doc.google_id) {
        res.send({
          result: true,
          google_id: doc.google_id
        });
      } else if (doc.wafflenote_id) {
        res.send({
          result: true,
          wafflenote_id: doc.wafflenote_id
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
});

module.exports = router;
