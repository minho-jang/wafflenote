var http = require("http");
var fs = require("fs");
var url = require("url");
var axios = require("axios");

const PROD_SERVER = "http://15.165.43.178:3000";

const waffle = axios.create({
  baseURL: PROD_SERVER,
});;

var app = http.createServer(function (request, response) {
  if(request.method == "OPTIONS") {
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": 86400
    });
    response.end();
  } else if (request.url == "/") {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*"});
    response.end(fs.readFileSync(__dirname + "/index.html"));
  } else {
    if (request.url === "/signin") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        console.log(newData);
        signIn(newData.type, newData.wafflenote_id, newData.password).then(
          (res) => {
            var result = undefined;
            if (res.data.whoami) {
              result = res.data.whoami.toString();
            }
            response.writeHead(200, { "Access-Control-Allow-Origin": "*"});
            response.end(result);
          }
        );
      });
    } else if (request.url === "/verify-email") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        // console.log(newData.email);
        // console.log(typeof newData.email);
        verifyEmailApi(newData.email).then((res) => {
          // console.log(res.data);
          response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
          response.end(res.data.result.toString());
        });
      });
    } else if (request.url === "/verify-code") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        // console.log(newData);
        verifyCodeApi(newData.email, newData.code).then((res) => {
          // console.log(res);
          response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
          response.end(res.data.result.toString());
        });
      });
    } else if (request.url === "/signup") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        // console.log(newData);
        waffleNoteSignUpApi(
          newData.wafflenote_id,
          newData.password,
          newData.name,
          newData.phone_number,
          newData.advertise_sms,
          newData.advertise_email
        ).then((res) => {
          // console.log(res);
          response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
          response.end(res.data.result.toString());
        });
      });
    } else if (request.url === "/find-password") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        // console.log(newData);
        findPasswordApi(newData.email).then((res) => {
          response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
          response.end(res.data.result.toString());
        });
      });
    } else if (request.url === "/find-id") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        // console.log(newData);
        findIdApi(newData.name, newData.phone_number).then((res) => {
          //  console.log(typeof res);
          response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
          response.end(res.data.wafflenote_id.toString());
        });
      });
    } else if (request.url === "/change-password") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        // console.log(newData);
        changePasswordApi(
          newData.wafflenote_id,
          newData.code,
          newData.new_pw
        ).then((res) => {
          response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
          response.end(res.data.result.toString());
        });
      });
    } else if (request.url === "/review" && request.method === "GET") {
      getReviewApi().then((res) => {
        response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
        response.end(JSON.stringify(res.data));
      });
    } else if (request.url === "/review" && request.method === "POST") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        postReviewApi(newData.content, newData.userId).then((res) => {
          response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
          response.end(JSON.stringify(res.data));
        });
      });
    } else if (request.url === "/mypage" && request.method === "POST") {
      request.on("data", (data) => {
        const newData = JSON.parse(data.toString());
        mypageApi(newData.wafflenoteId).then((res) => {
          console.log(res);
          response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
          response.end(JSON.stringify(res.data));
        });
      });
    } else {
      response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
      response.end(fs.readFileSync(__dirname + request.url));
    }
  }
});

app.listen(3000, () => {
  // console.log("Server running");
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

const findPasswordApi = async (email) => {
  var data = {
    email,
  };
  const response = await waffle.post("/find-password", data);
  // console.log(response);
  return response;
};

const findIdApi = async (name, phone_number) => {
  var data = {
    name,
    phone_number,
  };
  const response = await waffle.post("/find-id", data);
  // console.log(response);
  return response;
};

const changePasswordApi = async (wafflenote_id, code, new_pw) => {
  var data = {
    wafflenote_id,
    code,
    new_pw,
  };
  const response = await waffle.post("/change-password", data);
  // console.log(response);
  return response;
};

const getReviewApi = async () => {
  const response = await waffle.get("/review");
  return response;
};

const postReviewApi = async (content, userId) => {
  var data = { content, author: userId };
  const response = await waffle.post("/review", data);
  return response;
};

const mypageApi = async (wafflenoteId) => {
  var data = {
    wafflenoteId,
  };
  const response = await waffle.post("/mypage", data);
  return response;
};
