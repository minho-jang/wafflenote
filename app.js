var http = require("http");
var fs = require("fs");

var app = http.createServer(function (request, response) {
  var url = request.url;
  if (request.url == "/") {
    url = "/index.html";
  }
  console.log(url);
  response.writeHead(200);
  response.end(fs.readFileSync(__dirname + url));
});
app.listen(3000, () => {
  console.log("Server running");
});
