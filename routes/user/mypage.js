const express = require("express");

const router = express.Router();
const User = require("../../models/user").User;

// POST /mypage
router.post("/", async (req, res, next) => {
  console.log("POST /mypage");

  try {
    const doc = await User.findOne({
      wafflenote_id: req.body.wafflenoteId
    });

    if (doc && doc._id) {
      doc.password = undefined;
      doc.salt = undefined;

      res.send(doc);
    } else {
      res.status(404).send(`No such wafflenote id: ${req.body.wafflenoteId}`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }  
});

module.exports = router;

