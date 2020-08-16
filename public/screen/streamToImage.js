import waffle from '../apis/waffle.js';
import { getSlidesFromStorage } from '../apis/storage.js';
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

      const timerId = setInterval(async () => {
        try {
          ctx.drawImage(this, 0, 0);
          curr = canvas.toDataURL();
          const currBlob = dataURItoBlob(curr);
          const prevBlob = dataURItoBlob(prev);
          prev = curr;

          if (currBlob && prevBlob) {
            const fd = new FormData();
            fd.append('frameImg', prevBlob);
            fd.append('frameImg', currBlob);
            const response = await waffle.post('/api/frame', fd, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (response.data.result === 'True') {
              const script = await getScripts();
              if (script.transcription === '') return;

              const note = await getSlidesFromStorage('note');
              note.length !== 0 ? (note[note.length - 1].script = script.transcription) : '';
              note.push({
                title: `Slide ${id}`,
                id: id++,
                slide: curr,
                script: null,
                memo: null,
                tags: null,
              });
              chrome.storage.local.set({ note });
            }
          } else {
            const note = [
              {
                title: `Slide ${id}`,
                id: id++,
                slide: curr,
                script: null,
                memo: null,
                tags: null,
              },
            ];
            chrome.storage.local.set({ note });
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

export { captureImage };
