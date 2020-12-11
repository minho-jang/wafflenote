import { clearRecording, init, onended } from "./streamToMp3.js";
import { captureImage, stopCaptureImage } from "./streamToImage.js";
import { setState } from '../apis/storage.js';

setState(false);
let currentStream;

const cancelScreenSharing = () => {
  if (currentStream) {
    currentStream.getTracks().forEach(track => {
      console.log(track)
      track.stop();
      setState(false);
    })
  }
};

const requestScreenSharing = (port, msg) => {
  if (port.recorderPlaying) {
    // console.log("Ignoring second play, already playing");
    return;
  }
  port.recorderPlaying = true;
  const tab = port.sender.tab;
  chrome.desktopCapture.chooseDesktopMedia(
    ["tab", "audio"],
    tab,
    (streamId) => {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          {
            audio: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: streamId,
              },
            },
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: streamId,
                maxFrameRate: 1,
                minFrameRate: 1
              },
            },
          },
        (stream) => {
          currentStream = stream;
          setState(true)
          init(stream);
          captureImage(stream);
          clearRecording();
          stream.oninactive = function () {
            port.recorderPlaying = false;
            setState(false);

            // stop Capturing Image
            stopCaptureImage();

            // stop Audio
            onended();

          };
        },
        (err) => {
          console.log(
            "The following error occured: " + err.name + " " + err.message
          );
        }
        );
      } else {
        console.log("getUserMedia not supported");
      }
    }
  );
};

export { requestScreenSharing, cancelScreenSharing };
