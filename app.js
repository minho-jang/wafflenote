// ENV
require('dotenv').config();

// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const fs = require('fs');
const db = require('./db.js');

const app = express();
const port = process.env.NOTE_PORT || 3000;

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;

// Connect to MongoDB
const opts = { 
  sslValidate: true,
  sslCA:[fs.readFileSync(process.env.CA_PATH)],
  useNewUrlParser: true
};
const MONGO_URI = fs.readFileSync(process.env.MONGO_URI_PATH);
db(MONGO_URI, opts);

// Connect to MongoDB (Local)
// db("mongodb://localhost:27017/wafflenote");

// Routes
app.use("/api", require("./api/index"));

app.listen(port, () => console.log(`Server listening on port ${port}`));
