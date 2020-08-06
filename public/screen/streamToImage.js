const captureImage = (stream) => {
  const video = document.createElement('video');
  video.addEventListener(
    'loadedmetadata',
    function () {
      var canvas = document.createElement('canvas');
      canvas.width = window.screen.width;
      canvas.height = window.screen.height;
      const timerId = setInterval(() => {
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0);
        var url = canvas.toDataURL();
        console.log(url);
        const data = {};
        data['image'] = url;
        chrome.storage.local.set(data);
      }, 100);
      setTimeout(() => {
        clearInterval(timerId);
      }, 4000);
    },
    false,
  );
  video.srcObject = stream;
  video.play();
};
export { captureImage };
