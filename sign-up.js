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
    window.location.href = "/signup-form.html";
    // sign up api
  } else {
    alert("약관에 모두 동의하셔야 회원가입이 진행됩니다.");
  }
}

function signUp() {
  // sendserver
  const id = document.getElementById("name").value;
  const name = document.getElementById("name").value;
  const birth =
    document.getElementById("yy").value +
    document.getElementById("mm").value +
    document.getElementById("dd").value;
  const gender = document.getElementById("gender").value;
  const phone = document.getElementById("mobile").value;
  const organization = document.getElementById("organization").value;
  if (!id || !name) {
    alert("예상치 못한 문제가 발생했습니다. 다시 시도해 주세요.");
    window.location.href = "/";
  } else if (!birth) {
    alert("생년월일을 정확히 입력해주세요.");
  } else if (!gender) {
    alert("성별을 정확히 입력해주세요.");
  } else if (!phone) {
    alert("휴대전화번호를 정확히 입력해주세요.");
  } else {
    alert("회원가입이 완료되었습니다.");
    // 회원가입 API
  }
}

function changeMm() {
  let mm = document.getElementById("mm").value;
  if (mm.length === 1) mm = "0" + mm;
  document.getElementById("mm").value = mm;
}

function changeDd() {
  let dd = document.getElementById("dd").value;
  if (dd.length === 1) dd = "0" + dd;
  document.getElementById("dd").value = dd;
}
