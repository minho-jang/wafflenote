// ENV
require('dotenv').config({path: __dirname + '/.env'})

// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require("session-file-store")(session);

const app = express();
const port = process.env.NODE_PORT || 3000;

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

// session
const sessionConfig = require("./config/session.json");
app.use(session({
  secret: sessionConfig.secret,
  resave: false,
  saveUninitialized: true,
  store: new FileStore(),
  cookie: { maxAge: 300000 }  // 5 min
}));

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;

// Connect to DocumentDB (MongoDB)
const documentdbConfig = require("./config/documentdb");
const db = require('./lib/db');
const fs = require('fs');
const opts = { 
  sslValidate: true,
  sslCA:[fs.readFileSync(documentdbConfig.CA_PATH)],
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};
db(documentdbConfig.DB_URI, opts);

// Routes
app.use("/api", require("./api/index"));
app.use("/note", require("./routes/wafflenote/noteRest"));
app.use("/slide", require("./routes/wafflenote/slideRest"));
app.use("check-google-token", require("./routes/user/checkGoogleToken"));
app.use("/signin", require("./routes/user/signin"));
app.use("/signup", require("./routes/user/signup"));
app.use("/signout", require("./routes/user/signout"));

app.listen(port, () => console.log(`Server listening on port ${port}`));
