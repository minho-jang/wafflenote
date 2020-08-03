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
        var url = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        console.log(url);
        // will open the captured image in a new tab
        window.open(url);
      }, 2000);
      setTimeout(() => {
        clearInterval(timerId);
      }, 10000);
    },
    false,
  );
  video.srcObject = stream;
  video.play();
};
export { captureImage };
