// express 4.17.1
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// For parsing application/json
app.use(bodyParser.json());

// 라우팅 설정
app.use("/api", require("./api/index"));

app.listen(3000, function () {
  console.log("Server start on port 3000...");
});
