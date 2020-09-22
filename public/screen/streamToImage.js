import waffle from "../apis/waffle.js";
import {
  getOneSlideFromStorage,
  setSlideToStorage,
  setAudioToStorage,
  setStartTime,
} from "../apis/storage.js";
import { getScripts } from "./streamToMp3.js";

let currImage;
let prevImage;
let id;
let isPlaying;

function stopCaptureImage() {
  isPlaying = false;
}

async function compareImage(video, canvas, ctx, startTime){
  try {
    if (!isPlaying) return;
    ctx.drawImage(video, 0, 0);
    currImage = canvas.toDataURL();

    const currBlob = dataURItoBlob(currImage);
    const prevBlob = dataURItoBlob(prevImage);

    const curTime = new Date();
    if (currBlob && prevBlob) {
      const fd = new FormData();
      fd.append("frameImg", prevBlob, "image1.png");
      fd.append("frameImg", currBlob, "image2.png");
      const response = await waffle.post("/api/frame", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const diffTime = dateDiffToString(startTime, curTime).toString();
      if (response.data.result === "True") {
        console.log("changed!!")
        const script = await getScripts();

        console.log(script.data);
        if (script.transcription === "") return;
        await storePrevSlide(id-1, diffTime, script);
        await storeCurrSlide(id++, diffTime, currImage);
        prevImage = currImage;
      }
    } else {
      await storeCurrSlide(id++, "00:00", currImage);
      prevImage = currImage;
    }
    setTimeout(() => {
      compareImage(video, canvas, ctx, startTime)
    }, 1000)
  } catch (error) {
    console.log(error);
  }
}

const captureImage = (stream) => {
  const video = document.createElement("video");
  video.addEventListener(
    "loadedmetadata",
    function () {
      const canvas = document.createElement("canvas");
      canvas.width = window.screen.width;
      canvas.height = window.screen.height;
      const ctx = canvas.getContext("2d");

      currImage = null;
      prevImage = null;
      id = 1;
      isPlaying = true;
      let startTime = new Date();
      setStartTime(startTime.toUTCString());
      compareImage(video, canvas, ctx, startTime);
    },
    false
  );
  video.srcObject = stream;
  video.muted = true;
  video.play();
};

async function storeCurrSlide(id, startTime, currImage) {
  try{
    const slide = {
      title: `Slide ${id}`,
      id: id,
      slide: currImage,
      script: null,
      note: null,
      tags: null,
      startTimeInfo: startTime,
      endTimeInfo: null,
    };
    chrome.storage.local.set({ lastIndex: id });
    await setSlideToStorage("note", id, slide);
  } catch (error) {
    console.log(error)
  }
}

async function storePrevSlide(id, endTime, script) {
  try {
    const prevSlide = await getOneSlideFromStorage("note", id);
    prevSlide.script = script.transcription;
    prevSlide.endTimeInfo = endTime;
    await setAudioToStorage("note", id, script.audioBlob);
    await setSlideToStorage("note", id, prevSlide);
  } catch (error) {
    console.log(error)
  }
}

function dataURItoBlob(dataURI) {
  if (!dataURI) return null;
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

function dateDiffToString(a, b) {
  let diff = Math.abs(a - b);

  let ms = diff % 1000;
  diff = (diff - ms) / 1000;
  let ss = diff % 60;
  diff = (diff - ss) / 60;
  let mm = diff % 60;
  diff = (diff - mm) / 60;
  let hh = diff % 24;
  if (hh === 0) return mm + ":" + ss;
  return hh + ":" + mm + ":" + ss;
}

export { captureImage, stopCaptureImage };
