const express = require("express");

const User = require("../../models/user").User;
const router = express.Router();

// POST /find-password
router.post("/", async (req, res, next) => {
  console.log("POST /find-password");

  const uId = req.body.wafflenote_id;
  const uPhone = req.body.phone_number;

  try {
    const doc = await User.findOne({ wafflenote_id: uId, phone_number: uPhone });
    if (doc && doc._id) {
      // TODO 
      // 1. 랜덤 비밀번호 생성
      // 2. 비밀번호 디비에 저장
      // 3. 새 비밀번호 이메일(doc.wafflenote_id) 전송
      // 4. res.send({ result: true });
    } else {
      res.send({
        result: false
      })
    }
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
