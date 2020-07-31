/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */

const desktopMediaRequestId = "";

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    if (msg.type === "waffleNoteStart") {
      requestScreenSharing(port, msg);
    } else if (msg.type === "changeSlide") {
      // Defind method about slide changing
    } else if (msg.type === "waffleNoteEnd") {
      cancelScreenSharing(msg);
    }
  });
});

function requestScreenSharing(port, msg) {
  if (port.recorderPlaying) {
    // console.log("Ignoring second play, already playing");
    return;
  }
  port.recorderPlaying = true;
  const tab = port.sender.tab;

  chrome.desktopCapture.chooseDesktopMedia(
    ["screen", "window", "tab", "audio"],
    tab,
    streamId => {
      navigator.webkitGetUserMedia({
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
            minFrameRate: 1,
          },
        },
      }, stream => {
        const chunks = [];

        console.log(stream);

        recorder = new MediaRecorder(stream, {
          videoBitsPerSecond: 128000,
          audioBitsPerSecond: 128000,
          ignoreMutedMedia: true,
          mimeType: "video/webm",
        });
        recorder.ondataavailable = function(event) {
          if (event.data.size > 0) {
            chunks.push(event.data);
            console.log(event.data);
          }
        };

        recorder.onstop = function() {
          console.log(chunks);
          const superBuffer = new Blob(chunks, {
            type: "video/mp4",
          });

          const url = URL.createObjectURL(superBuffer);

          console.log(superBuffer);
          console.log(url);


          // var a = document.createElement('a');
          // document.body.appendChild(a);
          // a.style = 'display: none';
          // a.href = url;
          // a.download = 'test.webm';
          // a.click();

          chrome.downloads.download({
            url,
          // filenwame: "suggested/filename/with/relative.path" // Optional
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
