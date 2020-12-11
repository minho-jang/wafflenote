const express = require("express");

const router = express.Router();

// POST /check-google-token
// https://developers.google.com/identity/sign-in/web/backend-auth
router.get("/", async (req, res, next) => {
  console.log("POST /check-google-token");

  const {OAuth2Client} = require('google-auth-library');
  const googleConfig = require("../../config/google.json");
  const client = new OAuth2Client(googleConfig.GOOGLE_CLIENT_ID);
  const token = req.body;

  try { 
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleConfig.GOOGLE_CLIENT_ID,  
    });
    const payload = ticket.getPayload();
    console.log(payload);
    const userid = payload['sub'];
    const name = payload['name'];
    
    console.log(userid, name);
    res.send({
      result: true
    });
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
});


module.exports = router;
