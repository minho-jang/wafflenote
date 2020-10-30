// google
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token);

  // 토큰 유효성 검사

  window.location.href = "/";
}

const PROD_SERVER = "http://13.124.43.79/:3000";

const waffle = axios.create({
  baseURL: PROD_SERVER,
});

const signIn = async (type, wafflenote_id, password) => {
  var data = {
    type,
    wafflenote_id,
    password,
  };
  const response = await waffle.post("/signin", data);
  console.log(response);
  // console.log(document.cookie);
  // const user_info = await waffle.get("/user-info");
  // console.log(user_info);
  return response;
};

//wafflenote
function logIn() {
  const id = document.getElementById("id").value;
  const password = document.getElementById("password").value;
  if (!id) {
    alert("아이디를 입력해주세요.");
  } else if (!password) {
    alert("비밀번호를 입력해주세요.");
  } else {
    signIn("wafflenote", id, password).then((res) => {
      console.log(res.data);
      if (res.data) {
        alert("로그인 되었습니다.");

        // localStorage.setItem("cookie", );
        // window.location.href = "/";
      } else {
        alert("해당 계정이 없거나, 패스워드가 일치하지 않습니다.");
      }
    });
  }
}
