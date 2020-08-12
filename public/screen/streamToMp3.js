import waffle from '../apis/waffle.js';

let recBuffers = [[], []];
let recLength = 0;
let numChannels = 1;
let listening = false;
let context = {};

const config = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

function clearRecording() {
  recBuffers = [[], []];
  recLength = 0;
  listening = true;
}

async function getScripts() {
  try {
    const blob = await encodeMp3();
    var file = new File([blob], 'temp.mp3');
    var frm = new FormData();
    frm.append('audio', file);
    clearRecording();
    const response = await waffle.post('/api/stt', frm, config);
    return response.data
  } catch (error) {
    console.log(error);
  }
}

function encodeMp3() {
  return new Promise((resolve, reject) => {
    try {
      let buffers = [];
      for (var i = 0; i < numChannels; i++) {
        buffers.push(mergeBuffers(recBuffers[i], recLength));
      }

      let interleaved = numChannels == 2 ? interleave(buffers[0], buffers[1]) : buffers[0];
      let dataView = encodeWAV(interleaved);
      let blob = new Blob([dataView], { type: 'audio/wav' });
      const fr = new FileReader();    
      fr.onload = async () => {
        const array = new Int16Array(fr.result);
        const mp3Data = [];
        const mp3encoder = new lamejs.Mp3Encoder(1, 48000, 128); //mono 44.1khz encode to 128kbps
        let mp3Tmp = mp3encoder.encodeBuffer(array); //encode mp3
        mp3Data.push(mp3Tmp);
        mp3Tmp = mp3encoder.flush();
        mp3Data.push(mp3Tmp);
        resolve(new Blob(mp3Data, { type: 'audio/mp3' }));
      };
      fr.readAsArrayBuffer(blob);
      
    } catch (error) {
      reject(error)
    }
  });
}

function init(stream) {
  let audioContext = new AudioContext();
  let source = audioContext.createMediaStreamSource(stream);
  context = source.context;
  let node = (context.createScriptProcessor || context.createJavaScriptNode).call(context, 4096, numChannels, numChannels);
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

function mergeBuffers(buffers, len) {
  let result = new Float32Array(len);
  let offset = 0;
  for (var i = 0; i < buffers.length; i++) {
    result.set(buffers[i], offset);
    offset += buffers[i].length;
  }
  return result;
}

function interleave(inputL, inputR) {
  let len = inputL.length + inputR.length;
  let result = new Float32Array(len);

  let index = 0;
  let inputIndex = 0;

  while (index < len) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function floatTo16BitPCM(output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

function writeString(view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(samples) {
  var buffer = new ArrayBuffer(44 + samples.length * 2);
  var view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, context.sampleRate, true);
  view.setUint32(28, context.sampleRate * 4, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  floatTo16BitPCM(view, 44, samples);

  return view;
}

export { init, clearRecording, getScripts };
