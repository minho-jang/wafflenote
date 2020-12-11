import {
  requestScreenSharing,
  cancelScreenSharing,
} from "./screen/screenShare.js";

chrome.browserAction.onClicked.addListener(function (activeTab) {
  chrome.tabs.create({ url: chrome.extension.getURL("popup.html") }, function (
    tab
  ) {});
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.type === "waffleNoteStart") {
      requestScreenSharing(port, msg);
    } else if (msg.type === "changeSlide") {
      // Defind method about slide changing
    } else if (msg.type === "waffleNoteStop") {
      cancelScreenSharing(msg);
    } else if (msg.type === "waffleNotePause") {
      // Pause
    }
  });
});
