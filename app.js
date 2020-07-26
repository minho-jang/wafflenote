// express 4.17.1
const express = require("express");

const app = express();

// 라우팅 설정
app.use("/api", require("./api/index"));

app.listen(3000, function () {
  console.log("Server start on port 3000...");
});
