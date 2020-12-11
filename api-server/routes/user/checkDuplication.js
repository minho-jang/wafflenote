const express = require("express");
const userModel = require("../../models/user");

const User = userModel.User;
const router = express.Router();

// GET /check-duplication/:wafflenote_id
router.get("/:wafflenote_id", async (req, res, next) => {
  console.log("GET /check-duplication/:wafflenote_id");

  const uId = req.params.wafflenote_id;
  try {
    const doc = await User.findOne( {wafflenote_id: uId } );
    if (doc && doc._id) {
      res.send({
        result: false
      });
    } else {
      res.send({
        result: true
      });
    } 
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
