var http = require("http");
var fs = require("fs");
var url = require("url");
var axios = require("axios");

const PROD_SERVER = "http://15.165.43.178:3000";

const waffle = axios.create({
  baseURL: PROD_SERVER,
});

var app = http.createServer(function (request, response) {
  if (request.url == "/") {
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + "/index.html"));
  } else {
    if (request.url === "/signin") {
      // console.log(request.url);
      // console.log(request.method);
      // console.log(request.body);
      // var query = url.parse(request.url, true).query; //GET
      // console.log(JSON.stringify(query)); //GET
      request.on("data", (data) => {
        // console.log(data.toString());
        const newData = JSON.parse(data.toString());
        console.log(newData);
        signIn(newData.type, newData.wafflenote_id, newData.password).then(
          (res) => {
            console.log(res);
            response.writeHead(200);
            response.end(res.data.result.toString());
          }
        );
      });
    } else if (request.url == "/verify-email") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        console.log(newData);
        verifyCodeApi(newData.email).then((res) => {
          console.log(res);
          response.writeHead(200);
          response.end(res.data.result.toString());
        });
      });
    } else if (request.url == "/verify-code") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        console.log(newData);
        verifyEmailApi(newData.email, newData.code).then((res) => {
          console.log(res);
          response.writeHead(200);
          response.end(res.toString());
        });
      });
    } else if (request.url == "/signup") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        console.log(newData);
        waffleNoteSignUpApi(
          newData.wafflenote_id,
          newData.password,
          newData.name,
          newData.phone_number,
          newData.advertise_sms,
          newData.advertise_email
        ).then((res) => {
          console.log(res);
          response.writeHead(200);
          response.end(res.toString());
        });
      });
    } else {
      response.writeHead(200);
      response.end(fs.readFileSync(__dirname + request.url));
    }
  }
});

app.listen(3000, () => {
  console.log("Server running");
});

const signIn = async (type, wafflenote_id, password) => {
  var data = {
    type,
    wafflenote_id,
    password,
  };
  const response = await waffle.post("/signin", data);
  return response;
};

const verifyEmailApi = async (email) => {
  var data = {
    email,
  };
  const response = await waffle.post("/verify-email", data);
  return response;
};

const verifyCodeApi = async (email, code) => {
  var data = {
    email,
    code,
  };
  const response = await waffle.post("/verify-code", data);
  return response;
};

const waffleNoteSignUpApi = async (
  wafflenote_id,
  password,
  name,
  phone_number,
  advertise_sms,
  advertise_email
) => {
  var data = {
    type: "wafflenote",
    wafflenote_id,
    password,
    name,
    phone_number,
    use_count: 0,
    use_time: 0,
    remain_time: 0,
    note_list: [],
    agree: {
      privacy_policy: true,
      terms_of_use: true,
      advertise_email: advertise_email,
      advertise_sms: advertise_sms,
    },
  };
  const response = await waffle.post("/signup", data);
  return response;
};
