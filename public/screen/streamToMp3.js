import waffle from '../apis/waffle.js';

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

const worker = new Worker(chrome.extension.getURL('screen/mp3Worker.js'));

function getScripts() {
  return new Promise((resolve, reject) => {
    try {
      worker.addEventListener('message', function post(e) {
        const blob = e.data;
        const file = new File([blob], 'temp.mp3');
        const frm = new FormData();
        frm.append('audio', file);
        waffle.post('/api/stt', frm, config).then((res) => {
          worker.removeEventListener('message', post)
          resolve(res.data);
        });
      });
      worker.postMessage({ recBuffers, recLength, sampleRate: context.sampleRate });
      clearRecording();
    } catch (error) {
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

function onended() {
  source.disconnect(node);
  node.disconnect(context.destination);
  worker.terminate();
}

export { init, clearRecording, getScripts, onended };
