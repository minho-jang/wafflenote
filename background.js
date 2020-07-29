/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
const desktopMediaRequestId = "";

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    if (msg.type === "waffleNoteStart") {
      requestScreenSharing(port, msg);
    } else if (msg.type === "changeSlide") {
      // 1
    } else if (msg.type === "waffleNoteEnd") {
      cancelScreenSharing(msg);
    }
  });
});

function requestScreenSharing(port, msg) {
  if (port.recorderPlaying) {
    console.log("Ignoring second play, already playing");
    return;
  }
  port.recorderPlaying = true;
  const tab = port.sender.tab;

  chrome.desktopCapture.chooseDesktopMedia(
    ["screen", "window", "tab", "audio"],
    tab,
    streamId => {
    // Get the stream
      navigator.webkitGetUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: streamId,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720,
            minFrameRate: 60,
          },
        },
      }, stream => {
        const chunks = [];

        recorder = new MediaRecorder(stream, {
          videoBitsPerSecond: 2500000,
          ignoreMutedMedia: true,
          mimeType: "video/webm",
        });
        recorder.ondataavailable = function(event) {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = function() {
          const superBuffer = new Blob(chunks, {
            type: "video/webm",
          });

          const url = URL.createObjectURL(superBuffer);
          // var a = document.createElement('a');
          // document.body.appendChild(a);
          // a.style = 'display: none';
          // a.href = url;
          // a.download = 'test.webm';
          // a.click();

          chrome.downloads.download({
            url,
          // filename: "suggested/filename/with/relative.path" // Optional
          });
        };

        recorder.start();

        setTimeout(() => {
          recorder.stop();
        }, 10000);
      }, error => console.log("Unable to get user media", error));
    });
}

function cancelScreenSharing(msg) {
  if (desktopMediaRequestId) {
    chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
  }
}
