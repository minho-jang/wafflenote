import waffle from '../apis/waffle.js';

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
      const timerId = setInterval(async () => {
        ctx.drawImage(this, 0, 0);
        url = canvas.toDataURL();
        const response = await waffle.post('/images', {
          currImage: url,
          prevImage: prev,
        });
        if (response.data.id % 5 === 0) {
          const data = {
            image: url,
            id: response.data.id,
          };
          chrome.storage.local.set({ data });
        }

        prev = url;
      }, 1000);
      chrome.storage.local.set({ timerId });
    },
    false,
  );
  video.srcObject = stream;
  video.play();
};
export { captureImage };
