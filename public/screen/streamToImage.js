import waffle from '../apis/waffle.js';
import { getOneSlideFromStorage, setSlideToStorage, setAudioToStorage, getAudioFromStorage } from '../apis/storage.js';
import { getScripts } from './streamToMp3.js';

const captureImage = (stream) => {
  const video = document.createElement('video');
  video.addEventListener(
    'loadedmetadata',
    function () {
      const canvas = document.createElement('canvas');
      canvas.width = window.screen.width;
      canvas.height = window.screen.height;
      const ctx = canvas.getContext('2d');

      let curr;
      let prev;
      let id = 1;
      let startTime = new Date();
      const timerId = setInterval(async () => {
        try {
          ctx.drawImage(this, 0, 0);
          curr = canvas.toDataURL();
          const currBlob = dataURItoBlob(curr);
          const prevBlob = dataURItoBlob(prev);
          prev = curr;
          const curTime = new Date();
          if (currBlob && prevBlob) {
            const fd = new FormData();
            fd.append('frameImg', prevBlob, 'image1.png');
            fd.append('frameImg', currBlob, 'image2.png');
            const response = await waffle.post('/api/frame', fd, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            const diffTime = dateDiffToString(startTime, curTime).toString()
            if (response.data.result === 'True') {
              const script = await getScripts();
              if (script.transcription === '') return;
              
              const prevSlide = await getOneSlideFromStorage('note', id-1);
              prevSlide.script = script.transcription
              prevSlide.endTimeInfo = diffTime
              console.log(prevSlide)
              await setAudioToStorage('note', id-1, script.audioBlob)
              
              setSlideToStorage('note', id-1, prevSlide);
              
              const slide = {
                title: `Slide ${id}`,
                id: id,
                slide: curr,
                script: null,
                note: null,
                tags: null,
                startTimeInfo: diffTime,
                endTimeInfo: null,
              }
              chrome.storage.local.set({ lastIndex: id });
              setSlideToStorage('note', id++, slide);
            }
          } else {
            const slide = {
              title: `Slide ${id}`,
              id,
              slide: curr,
              script: null,
              note: null,
              tags: null,
              startTimeInfo: "0:00",
              endTimeInfo: null,
            }
            chrome.storage.local.set({ lastIndex: id });
            setSlideToStorage('note', id++, slide);
          }
        } catch (error) {
          console.log(error);
        }
      }, 5000);
      chrome.storage.local.set({ timerId });
    },
    false,
  );
  video.srcObject = stream;
  video.muted = true;
  video.play();
};

function dataURItoBlob(dataURI) {
  if (!dataURI) return null;
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
  else byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

function dateDiffToString(a, b){

  let diff = Math.abs(a - b);

  let ms = diff % 1000;
  diff = (diff - ms) / 1000
  let ss = diff % 60;
  diff = (diff - ss) / 60
  let mm = diff % 60;
  diff = (diff - mm) / 60
  let hh = diff % 24;
  if (hh === 0) return mm+":"+ss; 
  return hh+":"+mm+":"+ss;

}

export { captureImage };
