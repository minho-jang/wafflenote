import {
  requestSTT,
} from '../apis/waffle.js';

let recBuffers = [[]];
let recLength = 0;
let numChannels = 1;
let listening;
let audioContext;
let context = {};
let source;
let node;
const config = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};
      
function clearRecording() {
  recBuffers = [[]];
  recLength = 0;
  listening = true;
}

let worker;

function getScripts(status, startTime, endTime) {
  return new Promise((resolve, reject) => {
    try {
      worker = new Worker(chrome.extension.getURL('screen/mp3Worker.js'));

      worker.addEventListener('message', function post(e) {
        console.log(e)
        const blob = e.data;
        const file = new File([blob], 'temp.mp3');
        requestSTT(file, status, startTime, endTime)
          .then((res) => {
            resolve({...res.data, audioBlob: blob});
          })
          .catch((error) => {
            // TODO BUG: STT API 요청에서 timeout(5 min)이 지나면 순서 엉킴
            reject(error);
          })
      });
      console.log("Start encode")
      worker.postMessage({ recBuffers, recLength, sampleRate: context.sampleRate });
      clearRecording();
      console.log("Requested to Worker")
    } catch (error) {
      console.log(error)
      reject(error);
    }
  });
}

function init(stream) {
  listening = false;
  audioContext = new AudioContext();
  source = audioContext.createMediaStreamSource(stream);
  context = source.context;
  node = (context.createScriptProcessor || context.createJavaScriptNode).call(context, 4096, numChannels, numChannels);
  node.onaudioprocess = (e) => {
    if (!listening) return;
    for (var i = 0; i < numChannels; i++) {
      recBuffers[i].push([...e.inputBuffer.getChannelData(i)]);
    }
    recLength += recBuffers[0][0].length;
  };

  source.connect(node);
  node.connect(context.destination);
}

async function onended() {
  clearRecording()
  source.disconnect(node);
  node.disconnect(context.destination);
}

export { init, clearRecording, getScripts, onended };
