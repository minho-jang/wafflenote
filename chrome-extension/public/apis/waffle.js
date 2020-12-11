import {
  RUNNING,
  END,
  NOTE_ID,
  AUDIO,
  START_TIME,
  END_TIME,
  STATUS,
  FRAME_IMAGE,
} from './types.js'

const PROD_SERVER = 'http://15.165.43.178:3000'; 

const formConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 300000   // 300,000 ms = 5 min
}

let noteId;

export const waffle = axios.create({
  baseURL: PROD_SERVER,
});

export const startWaffle = async (firstImage) => {
  noteId = '';
  const fd = new FormData();
  fd.append(FRAME_IMAGE, firstImage, "image1.jpeg");

  const response = await waffle.post('/note', fd, formConfig);
  console.log("START_WAFFLE")
  noteId = response.data._id;
}

export const requestCompareImages = async (prevImage, currImage) => {
  const fd = new FormData();
  fd.append(NOTE_ID, noteId);
  fd.append(FRAME_IMAGE, prevImage, "image1.jpeg");
  fd.append(FRAME_IMAGE, currImage, "image2.jpeg");
  const response = await  waffle.post('/api/frame', fd, formConfig);
  return response.data.result
}

export const requestSTT = async (mp3, status, startTime, endTime) => {
  try {
    const fd = new FormData();
    fd.append(NOTE_ID, noteId);
    fd.append(AUDIO, mp3);
    fd.append(STATUS, status);
    fd.append(START_TIME, startTime);
    fd.append(END_TIME, endTime);
    const response = await waffle.post('/api/stt', fd, formConfig)
    return response.data
  } catch (err) {
    throw err;
  }
}

export const endWaffle = async (mp3) => {
  const fd = new FormData();
  fd.append(NOTE_ID, noteId);
  fd.append(AUDIO, mp3);
  fd.append(STATUS, END);
  fd.append(START_TIME, "");
  fd.append(END_TIME, "");
  const response = await waffle.post('/api/stt', fd, formConfig)
  return response.data
}

