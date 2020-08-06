import { beginRecording, init } from './streamToWav.js';
import { captureImage } from './streamToImage.js';

const requestScreenSharing = (port, msg) => {
  if (port.recorderPlaying) {
    // console.log("Ignoring second play, already playing");
    return;
  }
  port.recorderPlaying = true;
  const tab = port.sender.tab;

  chrome.desktopCapture.chooseDesktopMedia(['tab', 'audio'], tab, (streamId) => {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          audio: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: streamId,
            },
          },
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: streamId,
              maxFrameRate: 1,
              minFrameRate: 1,
            },
          },
        },
        (stream) => {
          init(stream);
          captureImage(stream);
          beginRecording();
          stream.oninactive = function () {
            port.recorderPlaying = false;
            /* TODO
              1. Stop Set Interval
              2. Store current status (active : true or false) 
            */
          };
        },
        (err) => {
          console.log('The following error occured: ' + err.name + ' ' + err.message);
        },
      );
    } else {
      console.log('getUserMedia not supported');
    }
  });
};

const cancelScreenSharing = (msg) => {
  if (desktopMediaRequestId) {
    chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
  }
};

export { requestScreenSharing, cancelScreenSharing };
