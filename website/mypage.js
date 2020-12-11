const PROD_SERVER = "https://wafflenote.com";
// const PROD_SERVER = "http://localhost:3000";

const waffle = axios.create({
  baseURL: PROD_SERVER,
});

const mypageApi = async (wafflenoteId) => {
  var data = {
    wafflenoteId,
  };
  const response = await waffle.post("/mypage", data);
  //console.log(response.data);

  return response;
};

function mypage() {
  const wafflenoteId = getCookie("wafflenote_id");
  mypageApi(wafflenoteId)
    .then((res) => {
      // console.log(res);
      const wafflenote_id = document.getElementById("wafflenote_id");
      wafflenote_id.placeholder = res.data.wafflenote_id;
      const name = document.getElementById("name");
      name.placeholder = res.data.name;
      const mobile = document.getElementById("mobile");
      mobile.placeholder = res.data.phone_number;
      const notenum = document.getElementById("notenum");
      notenum.placeholder = res.data.note_list.length;
    })
    .catch((error) => console.log(error));
}

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
