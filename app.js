// ENV
require('dotenv').config({path: __dirname + '/.env'})

// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const fs = require('fs');
const db = require('./db');

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
db(process.env.MONGO_URI, opts);

// Connect to MongoDB (Local)
// db("mongodb://localhost:27017/wafflenote");

// Routes
app.use("/api", require("./api/index"));
app.use("/note", require("./routes/noteRest"));
app.use("/slide", require("./routes/slideRest"));

app.listen(port, () => console.log(`Server listening on port ${port}`));
