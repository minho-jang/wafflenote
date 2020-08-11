import waffle from '../apis/waffle.js';
import { getSlidesFromStorage } from '../apis/storage.js';
import { clearRecording, getScripts } from './streamToMp3.js';

const captureImage = (stream) => {
  const video = document.createElement('video');
  video.addEventListener(
    'loadedmetadata',
    function () {
      const canvas = document.createElement('canvas');
      canvas.width = window.screen.width;
      canvas.height = window.screen.height;
      const ctx = canvas.getContext('2d');

      let url;
      let prev;
      let id = 0;

      const timerId = setInterval(async () => {
        ctx.drawImage(this, 0, 0);
        url = canvas.toDataURL();
        const currBlob = url ? dataURItoBlob(url) : null;
        const prevBlob = prev ? dataURItoBlob(prev) : null;
        const fd = new FormData(document.forms[0]);
        fd.append('frameImg', currBlob);
        // fd.append('prevImage', prevBlob);
        if (currBlob != null && id === 0) {
          const note =  [
            {
              slide: url,
              id: id++,
              script: null,
            },
          ];
          chrome.storage.local.set({ note });
        }
        const response = await waffle.post('/frame', fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.id % 10 === 0) {
          const script = await getScripts();
          const note = await getSlidesFromStorage('note');
          note[id-1].script = script.id;
          note[id] = {
            slide: prev,
            id: id++,
            script: null,
          }
          chrome.storage.local.set({ note });
          clearRecording();
        }

        prev = url;
      }, 1000);
      chrome.storage.local.set({ timerId });
    },
    false,
  );
  video.srcObject = stream;
  video.muted = true;
  video.play();
};

function dataURItoBlob(dataURI) {
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
