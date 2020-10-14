import React from "react";
import styled from "styled-components";

const Button = styled.button`
  margin-top: 24px;
  margin-left: 35px;
  width: 200px;
  height: 30px;
  border-radius: 18px;
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #fdeed0;
  border: 0px;
  outline: 0px;
  font-family: NotoSansKR;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  color: #ffbc3e;
  cursor: pointer;
  transition: all ease 0.5s 0s;
  :hover {
    background-color: #ffbc3e;
    color: white
  }
`;

const port = chrome.runtime.connect({
  name: "WaffleNote",
});

const CaptureButton = (props) => {
  const startCapture = () => {
    port.postMessage({ type: "waffleNoteStart", text: "start" }, "*");
  };

  return <Button onClick={startCapture}>강의 시작</Button>;
};

export default CaptureButton;
