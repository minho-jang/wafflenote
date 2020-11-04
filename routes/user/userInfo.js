const express = require("express");

const User = require("../../models/user").User;
const router = express.Router();

// GET /user-info
router.get("/", async (req, res, next) => {
  console.log("GET /user-info");

  const sess = req.session;

  try {
    const doc = await User.findById(sess.uuid);
    doc.password = undefined;
    res.send(doc);
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;

