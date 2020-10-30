isVerify = false;

const PROD_SERVER = "http://13.124.43.79:3000";

const waffle = axios.create({
  baseURL: PROD_SERVER,
});

const verifyEmailApi = async (email) => {
  var data = {
    email,
  };
  const response = await waffle.post("/verify-email", data);
  console.log(response);
  return response.data.result;
};

const verifyCodeApi = async (email, code) => {
  var data = {
    email,
    code,
  };
  const response = await waffle.post("/verify-code", data);
  console.log(response);
  return response.data.result;
};

const waffleNoteSignUpApi = async (
  wafflenote_id,
  password,
  name,
  phone_number,
  advertise_sms,
  advertise_email
  // organization,
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
  console.log(response);
  return response.data.result;
};

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token);

  // 토큰 유효성 검사

  window.location.href = "/signup-agree.html";
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
  const wafflenote_id = document.getElementById("wafflenote_id").value;
  const password1 = document.getElementById("password1").value;
  const password2 = document.getElementById("password2").value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("mobile").value;
  const advertise_email = document.getElementsByName("adv_agree")[0].checked;
  const advertise_sms = document.getElementsByName("adv_agree")[1].checked;

  if (!wafflenote_id) {
    alert("아이디를 입력해 주세요.");
  } else if (!isVerify) {
    alert("이메일 인증을 완료해 주세요.");
  } else if (!password1 | !password2) {
    alert("비밀번호를 입력해주세요.");
  } else if (!checkPassword(password1, password2)) {
    alert("비밀번호가 일치하지 않거나, 9자 미만입니다.");
  } else if (!name) {
    alert("이름을 입력해 주세요.");
  } else if (!phone) {
    alert("휴대전화번호를 정확히 입력해주세요.");
  } else {
    waffleNoteSignUpApi(
      wafflenote_id,
      password1,
      name,
      phone,
      advertise_email,
      advertise_sms
      // organization
    ).then((res) => {
      if (res) {
        alert("회원가입이 완료되었습니다.");
        window.location.href = "/";
      } else {
        alert(
          "회원가입 도중 문제가 발생하였습니다. 문제가 지속되는 경우 고객센터를 통해 문의해주세요."
        );
      }
    });
  }
}

function getTime() {
  m = Math.floor(setTime / 60) + "분 " + (setTime % 60) + "초";
  var msg = "<font color='red'>&nbsp;&nbsp;&nbsp;" + m + "</font>";
  var verify_time = document.querySelector("#verify_time");
  verify_time.innerHTML = msg;
  setTime--;
  if (setTime < 0) {
    clearInterval(tid);
  }
}

function verifyEmail() {
  const wafflenote_id = document.getElementById("wafflenote_id").value;
  if (!wafflenote_id) {
    alert("아이디(이메일)를 정확히 입력해 주세요.");
  } else {
    alert("인증번호가 전송되었습니다.");
    verifyEmailApi(wafflenote_id).then((res) => {
      console.log(res);
      if (res) {
        var verify_display = document.querySelector("#verify_html");
        verify_display.innerHTML =
          "<input type='text' id='verify_code' style='width:250px; height:30px' maxlength='30' placeholder=' 메일에 전송된 인증번호를 입력해주세요.'/><span style='padding-left:20px;'><button type='button' style='width:70px; height:30px; font-size:20px; text-align:center; color: white; background-color: #fbb93a; border: 0px; cursor: pointer;'onclick='verifyCode()'> 확인 </button></span></input><span id='verify_time'></span>";
        setTime = 300;
        tid = setInterval("getTime()", 1000);
      } else {
        alert(
          "다시 시도해 주세요. 문제가 지속되면 고객센터를 통해 문의해주세요."
        );
      }
    });
  }
}

function verifyCode() {
  const wafflenote_id = document.getElementById("wafflenote_id").value;
  const verify_code = document.getElementById("verify_code").value;
  if (!verify_code) {
    alert("인증번호를 정확히 입력해주세요.");
  } else {
    var verify_display = document.querySelector("#verify_html");
    verifyCodeApi(wafflenote_id, verify_code).then((res) => {
      if (res) {
        verify_display.innerHTML = "<div>인증되었습니다:)</div>";
        isVerify = true;
        clearInterval(tid);
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    });
  }
}

function checkPassword(password1, password2) {
  if (password1 != password2) {
    return false;
  }
  if (password1.length < 9) {
    return false;
  }
  return true;
}
