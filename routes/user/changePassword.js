const express = require("express");

const User = require("../../models/user").User;
const ObjectId = require("mongoose").Types.ObjectId;
const router = express.Router();

// POST /change-password
router.post("/", async (req, res, next) => {
  console.log("POST /change-password");
  
  const uuid = req.session.uuid;
  if (! uuid) {
    res.status(400).send("Need to signin");
    return;
  }

  const uId = req.body.wafflenote_id;
  const newPw = req.body.new_pw;

  try {
    const doc = await User.findOneAndUpdate(
      { _id: new ObjectId(uuid), wafflenote_id: uId },
      { $set: {password: newPw} },
      { new: true }
    );
    res.send(doc);
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
