const express = require("express");

const AuthEmail = require("../../models/authEmail").AuthEmail;
const User = require("../../models/user").User;
const ObjectId = require("mongoose").Types.ObjectId;
const emailConfig = require("../../config/email.json");
const router = express.Router();

// POST /change-password
router.post("/", async (req, res, next) => {
  console.log("POST /change-password");
  
  const uId = req.body.wafflenote_id;
  const uCode = req.body.code;
  const newPw = req.body.new_pw;

  try {
    const authEmailDocs = await AuthEmail.find(
      { email: uId, code: uCode }
    );
    
    if (authEmailDocs.length > 1) {
      res.status(500).send("Please contact our administrator.");
      return;
    }
    
    const authEmailDoc = authEmailDocs[0];
    const elapsed = authEmailDoc.expired.getTime() - Date.now();
    if (elapsed > 0 && elapsed < emailConfig.EXPIRED_TIME) {
      const doc = await User.findOneAndUpdate(
        { wafflenote_id: uId },
        { $set: {password: newPw} },
        { new: true }
      );
      res.send({
        result: true,
        document: doc
      });

    } else {
      res.send({
        result: false,
        message: "Expire"
      });
    }
    
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
