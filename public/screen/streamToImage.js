import {
  requestCompareImages,
  startWaffle,
} from "../apis/waffle.js";

import {
  RUNNING,
  END,
} from '../apis/types.js';

import {
  getOneSlideFromStorage,
  setSlideToStorage,
  setAudioToStorage,
  setStartTime,
} from "../apis/storage.js";

import { getScripts, init } from "./streamToMp3.js";

let currImage;
let prevImage;
let id;
let isPlaying;

let startTime;
let curTime;
let initTime;

function stopCaptureImage() {
  getScripts(END, dateDiffToString(initTime, startTime), dateDiffToString(initTime, new Date()))
    .then((res) => {

    })
    .catch((err) => {

    })
  isPlaying = false;
}

async function compareImage(video, canvas, ctx){
  try {
    if (!isPlaying) return;
    ctx.drawImage(video, 0, 0);
    currImage = canvas.toDataURL('image/jpeg');

    const currBlob = dataURItoBlob(currImage);
    const prevBlob = dataURItoBlob(prevImage);

    if (prevBlob) {
      const response = await requestCompareImages(prevBlob, currBlob)
      console.log(response);
      if (response === "True") {
        console.log("changed!!")
        curTime = new Date();
        await getScripts(RUNNING, dateDiffToString(initTime ,startTime), dateDiffToString(initTime, curTime));
        prevImage = currImage;
        startTime = curTime;
      }
    } else {
      await startWaffle(currBlob);
      prevImage = currImage;
    }
    setTimeout(() => {
      compareImage(video, canvas, ctx)
    }, 1000)
  } catch (error) {
    setTimeout(() => {
      compareImage(video, canvas, ctx)
    }, 1000)
    console.log(error);
  }

}

const captureImage = (stream) => {
  const video = document.createElement("video");
  video.addEventListener(
    "loadedmetadata",
    function () {
      const canvas = document.createElement("canvas");
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      const ctx = canvas.getContext("2d");

      currImage = null;
      prevImage = null;
      id = 1;
      isPlaying = true;
      startTime = new Date();
      initTime = new Date();
      setStartTime(startTime.toUTCString());
      compareImage(video, canvas, ctx);
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
