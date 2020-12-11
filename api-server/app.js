// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require("session-file-store")(session);
const cors = require("cors");

const app = express();
const port = require("./config/nodeserver.json").PORT || 3000;

// CORS
app.use(cors());

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

// session
const sessionConfig = require("./config/session.json");
app.use(session({
  secret: sessionConfig.secret,
  resave: true,
  saveUninitialized: false,
  rolling: true,
  store: new FileStore(),
  cookie: { maxAge: 3600000 }  // 3,600,000 ms > 1 hour
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
app.use("/", require("./routes/index"));
app.use("/api", require("./api/index"));

app.listen(port, () => console.log(`Server listening on port ${port}`));
