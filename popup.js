/* eslint-disable no-undef */
// eslint-disable-next-line no-alert
alert("와플노트 결과물에 대해서 본인만 사용하고, 타인에게 공유를 하지 않고 상업적으로 이용하지 않습니다. 이와 관련된 어떤 법적 이슈도 (주)와플노트에서는 책임 지지 않습니다.");

extensionInstalled = false;

const port = chrome.runtime.connect({
  name: "WaffleNote",
});

port.onMessage.addListener(msg => {
  const type = msg.type;

  if (type === "waffleNoteStart") {
    // change chrome storage => state : active;
  } else if (type === "changeSlide") {
    // transfer data(wav file) to server;
  } else if (type === "waffleNoteEnd") {
    // change chrome storage => state : inactive;
  }
});

window.onload = () => {
  document.getElementById("start_end").addEventListener("click", () => {
    if (document.getElementById("start_end").innerHTML === "강의 시작") {
      document.getElementById("start_end").innerHTML = "강의 종료";
      port.postMessage({type: "waffleNoteStart", text: "start"}, "*");
    } else {
      document.getElementById("start_end").innerHTML = "강의 시작";
      port.postMessage({type: "waffleNoteEnd", text: "start"}, "*");
    }
  });
};

// document.getElementById("change").addEventListener("click", () => {
//   if (!extensionInstalled) {
//     port.postMessage({type: "changeSlide", text: "start"}, "*");
//   }
// });
