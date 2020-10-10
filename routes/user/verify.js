const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../../models/user").User;
const AuthEmail = require("../../models/authEmail").AuthEmail;
const router = express.Router();
const emailConfig = require("../../config/email.json");

// POST /verify-email
router.post("/verify-email", async (req, res, next) => {
  console.log("POST /verify-email");

  try {
    const expireTime = emailConfig.EXPIRED_TIME;
    const uEmail = req.body.email;
    const doc = await User.findOne({
      $or: [{ wafflenote_id: uEmail }, { google_id: uEmail }],
    });
    console.log(doc);

    if (doc && doc._id) {
      res.send({
        result: false,
        message: "Already exists"
      });
    } else {
      let token = crypto.randomBytes(4).toString("hex");
      const newAuthEmail = new AuthEmail({
        email: uEmail,
        code: token,
        expired: new Date(Date.now() + expireTime),
      });
      const doc = await newAuthEmail.save();

      // nodemailer Transport 생성
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: emailConfig.WAFFLENOTE_EMAIL,
          pass: emailConfig.WAFFLENOTE_EMAIL_PASS,
        },
      });
      const emailOptions = {
        from: emailConfig.WAFFLENOTE_EMAIL,
        to: uEmail,
        subject: "[와플노트] 회원가입 인증 코드 알림",
        text: "인증코드 : " + token,
      };
      const emailResponse = await transporter.sendMail(emailOptions);
      res.send({
        result: true,
        emailResponse: emailResponse
      })
    }
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// POST /verify-code
router.post("/verify-code", async (req, res, next) => {
  console.log("POST /verify-code");

  const uEmail = req.body.email;
  const uCode = req.body.code;

  try {
    const doc = await AuthEmail.findOne({
      email: uEmail,
      code: uCode
    });

    if (doc && doc._id) {
      const elapsed = doc.expired.getTime() - Date.now();
      if (elapsed < emailConfig.EXPIRED_TIME) {
        res.send({
          result: true
        });
      } else {
        res.send({
          result: false,
          message: "Expire"
        });
      }
    } else {
      res.send({
        result: false,
        message: "Wrong email or code"
      });
    }
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
