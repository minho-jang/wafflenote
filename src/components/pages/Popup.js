import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getState } from "../../apis/storage";

import CaptureButton from "./CaptureButton";
import StopButton from "./StopButton";
import { getLastCapturedImage } from "../../apis/storage";
import waffleLogo from "../../static/waffleLogo.png";

const Button = styled(Link)`
  margin-top: 12px;
  margin-left: 35px;
  width: 200px;
  height: 30px;
  border-radius: 18px;
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #fdeed0;
  border: 0px;
  outline: 0px;
  text-align: center;
  font-family: NotoSansKR;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 30px;
  color: #ffbc3e;
  &:hover: {
    color: #ffbc3e;
  }
`;

const InfoTrue = styled.div`
  margin-top:50px;
  margin-left:px
  width: 171px;
  height: 18px;
  font-family: NotoSansKR;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;

const InfoFalse = styled.div`
  margin-top:10px;
  margin-left:50px
  width: 171px;
  height: 18px;
  font-family: NotoSansKR;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;

const Title = styled.img`
  width: 103px;
  height: 16px;
  margin-top: 12px;
  margin-left: 11px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 270px;
  height: 430px;
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffbc3e;
`;

const ImageTrue = styled.img`
  margin-top: 4px;
  margin-left: 35px;
  width: 200px;
  height: 140px;
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
`;

const ImageFalse = styled.img`
  margin-top: 69px;
  margin-left: 35px;
  width: 200px;
  height: 140px;
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
`;

const Time = styled.div`
margin-top:10px;
margin-left:120px
width: 30px;
height: 18px;
font-family: NotoSansKR;
font-size: 12px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1.5;
letter-spacing: normal;
text-align: center;
color: #ffffff;
`;

const Popup = () => {
  const [curSlide, setCurSlide] = useState({});
  const [curState, setCurState] = useState(false);

  useEffect(() => {
    setImage();
    setInterval(async () => {
      setImage();
    }, 2000);
  }, []);

  const setImage = async () => {
    const response = await getLastCapturedImage("note");

    setCurSlide(response);
  };

  getState().then((state) => {
    setCurState(state);
  });

  if (curState === true) {
    // 와플노트 실행중
    return (
      <Container>
        <Title src={waffleLogo} />
        {curSlide.id}
        <InfoTrue>현재 슬라이드</InfoTrue>
        <ImageTrue src={curSlide.slide} />
        <Time> 00:00 </Time>
        <StopButton />
        <Button to="/notes/1" target="_blank">
          요약중인 노트보기
        </Button>
      </Container>
    );
  } else {
    // 와플노트 종료
    return (
      <Container>
        <Title src={waffleLogo} />
        {curSlide.id}
        <ImageFalse src={curSlide.slide} />
        <InfoFalse>현재 탭에서 강의를 듣고 계신가요?</InfoFalse>
        <CaptureButton />
        <Button to="/notes/1" target="_blank">
          와플노트 바로가기
        </Button>
      </Container>
    );
  }
};

export default Popup;
