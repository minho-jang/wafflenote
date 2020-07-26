// 테스트용 영상 처리 서버 코드.
// 새로운 레포지토리에 영상처리 엔진 서버 개발 전 테스트를 위한 코드입니다.
// 포트 8080으로 열어서 POST 요청으로 온 파일을 저장하고 예시 결과를 리턴합니다.

const express = require("express");
const app = express();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  // 파일 저장 경로
  destination(req, file, cb) {
    cb(null, "api/tmp/frames/");
  },
  // 파일 저장 이름
  filename(req, file, cb) {
    cb(null, `test_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
});

app.post("/", upload.single("image"), (req, res, next) => {
  if (!req.file) {
    res.status(400).json({
      message: "No such file",
    });
    return;
  }

  // Something to do about the frame image...

  res.status(200).json({
    message: "Good !",
    isChanged: false,
    coordinates: {
      leftBottom: [30, 30],
      rightTop: [250, 310],
    },
  });
});

app.listen(8080, function () {
  console.log("Server start on port 8080...");
});