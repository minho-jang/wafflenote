function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token);

  // 토큰 유효성 검사

  window.location.href = "http://localhost:8080/signup-agree.html";
}

function valueCheck() {
  var check_count = document.getElementsByName("agree").length;
  var agreeCnt = 0;
  for (var i = 0; i < check_count; i++) {
    if (document.getElementsByName("agree")[i].checked == true) {
      agreeCnt += 1;
    }
  }
  if (agreeCnt === 2) {
    alert("약관에 모두 동의하셨습니다.");
    // sign up api
  } else {
    alert("약관에 모두 동의하셔야 회원가입이 진행됩니다.");
  }
}

function signUp() {
  console.log(123);
}
