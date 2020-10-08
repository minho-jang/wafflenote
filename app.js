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

// Connect to MongoDB (Local)
// db("mongodb://localhost:27017/wafflenote");

// Routes
app.use("/api", require("./api/index"));
app.use("/note", require("./routes/noteRest"));
app.use("/slide", require("./routes/slideRest"));
app.use("check-google-token", require("./routes/checkGoogleToken"));
app.use("/signin", require("./routes/signin"));
app.use("/signup", require("./routes/signup"));
// app.use("/logout", require("./routes/logout"));

app.listen(port, () => console.log(`Server listening on port ${port}`));
