var http = require("http");
var fs = require("fs");

var app = http.createServer(function (request, response) {
  var url = request.url;
  if (request.url == "/") {
    url = "/index.html";
  }
  response.writeHead(200);
  response.end(fs.readFileSync(__dirname + url));
});
app.listen(80, () => {
  console.log("Server running");
});
