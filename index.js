function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  // console.log(matches);
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
  options = {
    path: "/",
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie() {
  // console.log(12312312);
  setCookie("wafflenote_id", "", {
    "max-age": -1,
  });
  setCookie("wafflenote_user", "", {
    "max-age": -1,
  });
}

function checkLoginStatus() {
  var loginBtn = document.getElementById("loginBtn");
  var signupBtn = document.getElementById("signupBtn");
  const res = getCookie("wafflenote_user");
  // console.log(res);
  if (res) {
    // console.log("logined");
    loginBtn.innerHTML = "로그아웃";
    loginBtn.href = "/";
    signupBtn.innerHTML = "마이페이지";
    signupBtn.href = "/mypage.html";
  } else {
    // console.log("logouted");
    loginBtn.innerHTML = "로그인";
    loginBtn.href = "/sign-in.html";
    signupBtn.innerHTML = "회원가입";
    signupBtn.href = "/sign-up.html";
  }
}

checkLoginStatus();

// function checkGoogleLoginStatus() {
// 	var loginBtn = document.querySelector('#loginBtn');
// 	var signupBtn = document.querySelector('#signupBtn')
// 	if(gauth.isSignedIn.get()){
// 		console.log('logined');
// 		loginBtn.innerHTML = '로그아웃';
// 		loginBtn.href = "/"
// 		signupBtn.innerHTML = '마이페이지';
// 		signupBtn.href = "/mypage.html";
// 	} else{
// 		console.log('logouted');
// 		loginBtn.innerHTML = '로그인';
// 		loginBtn.href = '/sign-in.html';
// 		signupBtn.innerHTML = '회원가입';
// 		signupBtn.href = "/sign-up.html";
// 	}
// }
// function google_init(){
// 	console.log('init');
// 	gapi.load('auth2', function() {
// 		console.log('auth2');
// 		window.gauth = gapi.auth2.init({
// 			client_id: "1093419023025-jmlfuase62kn4sg5si66tpslg92bacbl.apps.googleusercontent.com"
// 		})
// 		gauth.then(function(){
// 			console.log('googleAuth success');
// 			checkLoginStatus();
// 		}, function(){
// 			console.log('googleAuth fail');
// 		})
// 	})
// }
