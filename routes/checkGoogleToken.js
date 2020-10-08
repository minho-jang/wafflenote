const express = require("express");

const router = express.Router();

// GET /check-google-token
// https://developers.google.com/identity/sign-in/web/backend-auth
router.get("/", async (req, res, next) => {
  console.log("GET /check-google-token");

  const {OAuth2Client} = require('google-auth-library');
  const googleConfig = require("../config/google.json");
  const client = new OAuth2Client(googleConfig.GOOGLE_CLIENT_ID);
  const token = req.query.idtoken;

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
    res.send('true');
  } catch(err) {
    console.log(err);
    res.send('false');
  }
});


module.exports = router;
