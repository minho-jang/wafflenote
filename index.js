import { generateKeyPair } from "crypto";

function init() {
  console.log("init");
  gapi.load("auth2", function () {
    console.log("auth2");
  });
}
