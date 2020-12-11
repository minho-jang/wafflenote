importScripts('lame.min.js');

let numChannels = 1;
const mp3encoder = new lamejs.Mp3Encoder(1, 48000, 128); //mono 44.1khz encode to 128kbps
let sampleRate

async function encodeMp3(recBuffers, recLength, sampleRate ) {
  sampleRate = sampleRate   
  try {
    let buffers = [];
    buffers.push(mergeBuffers(recBuffers[0], recLength));
    
    let dataView = encodeWAV(buffers[0]);
    let blob = new Blob([dataView], { type: 'audio/wav' });   
    const aBuffer = await new Response(blob).arrayBuffer()
    const array = new Int16Array(aBuffer);
    const mp3Data = [];
    let mp3Tmp = mp3encoder.encodeBuffer(array); //encode mp3
    mp3Data.push(mp3Tmp);
    mp3Tmp = mp3encoder.flush();
    mp3Data.push(mp3Tmp);
    return new Blob(mp3Data, { type: 'audio/mp3' }) 
    
  } catch (error) {
    return error
  }
}

self.addEventListener('message', function(e) {
  const { recBuffers, recLength } = e.data;
  encodeMp3(recBuffers, recLength)
    .then((result) => {
      self.postMessage(result);
      self.close();
    })
    .catch((e) => {
      self.postMessage(e.toString());
      self.close();
    })
});

function mergeBuffers(buffers, len) {
  let result = new Float32Array(len);
  let offset = 0;
  for (var i = 0; i < buffers.length; i++) {
    result.set(buffers[i], offset);
    offset += buffers[i].length;
  }
  return result;
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
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  floatTo16BitPCM(view, 44, samples);

  return view;
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
