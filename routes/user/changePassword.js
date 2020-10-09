const express = require("express");

const User = require("../../models/user").User;
const router = express.Router();

// POST /change-password
router.post("/", async (req, res, next) => {
  console.log("POST /change-password");

  const uId = req.body.wafflenote_id;
  const newPw = req.body.new_pw;

  try {
    const doc = await User.findOneAndUpdate(
      { wafflenote_id: uId },
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
