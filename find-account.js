const PROD_SERVER = "https://wafflenote.com";
// const PROD_SERVER = "http://localhost:3000";

const waffle = axios.create({
  baseURL: PROD_SERVER,
});

const findPasswordApi = async (email) => {
  var data = {
    email,
  };
  const response = await waffle.post("/find-password", data);
  // console.log(response);
  return response.data;
};

const verifyCodeApi = async (email, code) => {
  var data = {
    email,
    code,
  };
  const response = await waffle.post("/verify-code", data);
  // console.log(response);
  return response.data;
};

const findIdApi = async (name, phone_number) => {
  var data = {
    name,
    phone_number,
  };
  const response = await waffle.post("/find-id", data);
  // console.log(typeof response.data);
  // console.log(response.data);
  return response.data;
};

const changePasswordApi = async (wafflenote_id, code, new_pw) => {
  var data = {
    wafflenote_id,
    code,
    new_pw,
  };
  const response = await waffle.post("/change-password", data);
  // console.log(response);
  return response.data;
};

function find_id() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("mobile").value;
  if (!name) {
    alert("이름을 입력해 주세요.");
  } else if (!phone) {
    alert("휴대전화번호를 정확히 입력해주세요.");
  } else {
    findIdApi(name, phone).then((res) => {
      // console.log(res);
      if (res) {
        // console.log(res);
        const newid = document.querySelector("#new_id");
        if (res) {
          newid.innerHTML =
            "<br/><br/><br/><br/><br/><br/><br/><div style='font-size:30px; padding-left:90px'>" +
            res +
            "</div>";
        } else if (res.google_id) {
          newid.innerHTML =
            "<br/><br/><br/><br/><br/><br/><br/><div style='font-size:30px; padding-left:90px'>" +
            res.data.google_id +
            "</div>";
        }
      } else {
        alert(
          "입력하신 정보가 일치하는 계정이 존재하지 않거나, 가입하지 않은 회원이십니다."
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
    findPasswordApi(wafflenote_id).then((res) => {
      // console.log(res);
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
  verify_code = document.getElementById("verify_code").value;
  if (!verify_code) {
    alert("인증번호를 정확히 입력해주세요.");
  } else {
    var verify_display = document.querySelector("#verify_html");
    verifyCodeApi(wafflenote_id, verify_code).then((res) => {
      if (res) {
        verify_display.innerHTML = "<div>인증되었습니다:)</div>";
        isVerify = true;
        const new_password = document.querySelector("#new_password");
        new_password.innerHTML =
          "<div><h3><label for='id'>아이디</label></h3><span class='box int_id'><span id='wafflenote_id'>" +
          wafflenote_id +
          "</span></span></div>" +
          "<div><h3 class='join_title'><label for='name'>새 비밀번호</label></h3>" +
          "<span class='box int_name'><span class='step_url'></span>" +
          "<input type='password' id='password1' class='int' maxlength='20' placeholder='숫자, 영문, 특수문자를 혼합하여 9자 이상 입력해주세요.'/>" +
          "</span></div><div><h3 class='join_title'><label for='name'>새 비밀번호 확인</label>" +
          "</h3><span class='box int_name'><span class='step_url'></span>" +
          "<input type='password'id='password2'class='int'maxlength='20'placeholder='숫자, 영문, 특수문자를 혼합하여 9자 이상 입력해주세요.'/>" +
          "</span></div>";
        clearInterval(tid);
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    });
  }
}

function changePassword() {
  // sendserver
  const wafflenote_id = document.getElementById("wafflenote_id").innerHTML;
  const password1 = document.getElementById("password1").value;
  const password2 = document.getElementById("password2").value;

  if (!wafflenote_id) {
    alert("아이디를 입력해 주세요.");
  } else if (!isVerify) {
    alert("이메일 인증을 완료해 주세요.");
  } else if (!password1 | !password2) {
    alert("비밀번호를 입력해주세요.");
  } else if (!checkPassword(password1, password2)) {
    alert("비밀번호가 일치하지 않거나, 9자 미만입니다.");
  } else {
    // console.log(wafflenote_id);
    // console.log(verify_code);
    // console.log(password1);
    changePasswordApi(wafflenote_id, verify_code, password1).then((res) => {
      alert("비밀번호 변경이 완료되었습니다.");
      window.location.href = "/";
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
