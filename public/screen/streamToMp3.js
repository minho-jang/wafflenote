let recBuffers = [[], []];
let recLength = 0;
let numChannels = 1;
let listening = false;
let timeout = null;
let context = {};

function beginRecording() {
  recBuffers = [[], []];
  recLength = 0;
  listening = true;
  timeout = setTimeout(() => {
    endRecording();
  }, 10000);
}

function endRecording() {
  clearTimeout(timeout);
  timeout = null;
  encodeMp3();
}

function init(stream) {
  let audioContext = new AudioContext();
  let source = audioContext.createMediaStreamSource(stream);
  context = source.context;
  let node = (
    context.createScriptProcessor || context.createJavaScriptNode
  ).call(context, 4096, numChannels, numChannels);
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

function encodeMp3() {
  let buffers = [];
  for (var i = 0; i < numChannels; i++) {
    buffers.push(mergeBuffers(recBuffers[i], recLength));
  }

  let interleaved =
    numChannels == 2 ? interleave(buffers[0], buffers[1]) : buffers[0];
  let dataView = encodeWAV(interleaved);
  let blob = new Blob([dataView], { type: "audio/wav" });
  // blob.name = Math.floor(new Date().getTime() / 1000) + ".wav";

  const fr = new FileReader();
  fr.onload = () => {
    const array = new Int16Array(fr.result);
    console.log(array);
    var mp3Data = [];
    var mp3encoder = new lamejs.Mp3Encoder(1, 48000, 128); //mono 44.1khz encode to 128kbps
    var mp3Tmp = mp3encoder.encodeBuffer(array); //encode mp3
    mp3Data.push(mp3Tmp);
    mp3Tmp = mp3encoder.flush();
    mp3Data.push(mp3Tmp);
    var blob = new Blob(mp3Data, { type: "audio/mp3" });

    const url = URL.createObjectURL(blob);
    console.log(url);
    chrome.downloads.download({
      url: url,
    });
  };
  fr.readAsArrayBuffer(blob);

  // const urlWav = URL.createObjectURL(blob);
  // var file = new File([blob], "temp.wav");

  // // get
  // var frm = new FormData();
  // frm.append("audio", file);
  // axios
  //   .post("http://13.125.209.214:3000/api/stt", frm, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   })
  //   .then((response) => {
  //     console.log(response);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  // // 크롬 스토리지로 ~

  // chrome.downloads.download({
  //   url: urlWav,
  // });

  listening = false;

  return blob;
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

  /* RIFF identifier */
  writeString(view, 0, "RIFF");
  /* file length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, "WAVE");
  /* format chunk identifier */
  writeString(view, 12, "fmt ");
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, context.sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, context.sampleRate * 4, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, "data");
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return view;
}

export { init, beginRecording };
