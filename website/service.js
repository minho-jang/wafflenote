const PROD_SERVER = "https://wafflenote.com";
// const PROD_SERVER = "http://localhost:3000";

const waffle = axios.create({
  baseURL: PROD_SERVER,
});

const callGetReview = () => {
  return new Promise((resolve, reject) => {
    waffle.get("/review")
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    })
  });
};

const callPostReview = (content) => {
  const userId = getCookie("wafflenote_id");
  if (! userId) {
    return false;
  } else {
    return new Promise((resolve, reject) => {
      var data = { content, userId };
      waffle.post("/review", data)
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        console.log(err);
        reject(false);
      });
    });
  }
}

async function showReviews() {
  const res = await callGetReview();
  if (res.data.length == 0) {
    document.getElementById("review-list").innerHTML = "글이 없습니다.";
  } else {
    const reviewList = res.data;
    
    let reviews = "";
    for (var i = 0; i < reviewList.length; i++) {
      const value = reviewList[i];
      reviews = reviews.concat(i);
      reviews = reviews.concat("\t");
      reviews = reviews.concat(value.author);
      reviews = reviews.concat("\t\t");
      reviews = reviews.concat(ISODateToString(value.createdAt));
      reviews = reviews.concat("\n");
      reviews = reviews.concat(value.content);
      reviews = reviews.concat("\n\n");
    }

    document.getElementById("review-list").innerHTML = reviews;
  }
}

async function postReview() {
  const content = document.getElementById("review").value;
  const postOK = await callPostReview(content);
  if (postOK) {
    window.location.href = "/service.html";
  } else {
    alert("Need to signin");
  }
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

function ISODateToString(iso) {
  let date = new Date(iso);
  let year = date.getFullYear().toString().substr(2,2);
  let month = date.getMonth()+1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  let hours = date.getHours(); 
  let min = date.getMinutes();  
  let sec = date.getSeconds();
  
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (sec < 10) {
    sec = '0' + sec;
  }

  return year + '/' + month + '/' + dt + " " + hours + ":" + min + ":" + sec;
}

showReviews();
