const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../../models/user").User;
const AuthEmail = require("../../models/authEmail").AuthEmail;
const router = express.Router();
const emailConfig = require("../../config/email.json");

// POST /find-password
router.post("/", async (req, res, next) => {
  console.log("POST /find-password");

  try {
    const expireTime = emailConfig.EXPIRED_TIME;
    const uEmail = req.body.email;
    const doc = await User.findOne({
      $or: [{ wafflenote_id: uEmail }, { google_id: uEmail }],
    });

    if (doc && doc._id) {
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
        subject: "[와플노트] 비밀번호 찾기 인증 코드 알림",
        text: "인증코드 : " + token,
      };
      const emailResponse = await transporter.sendMail(emailOptions);
      res.send({
        result: true,
        emailResponse: emailResponse
      });
      
    } else {
      res.send({
        result: false,
        message: "Wrong email"
      });
    }
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
