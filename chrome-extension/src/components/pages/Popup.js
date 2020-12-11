import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { signOut } from '../../actions/auth';
import { getState, getStartTime } from '../../apis/storage';
import { getRecentNote } from '../../actions/notes';
import CaptureButton from './CaptureButton';
import StopButton from './StopButton';
import { getNoteId, logout } from '../../apis/utils';
import PopupContainer from '../presenter/PopupContainer';
import PopupHeader from '../presenter/PopupHeader';
import PopupCircleLogo from '../presenter/PopupCircleLogo';
import PopupFooter from '../presenter/PopupFooter';

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
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 30px;
  color: #ffbc3e;

  transition: all ease 0.5s 0s;
  :hover {
    background-color: #ffbc3e;
    color: white
  }
`;

const InfoTrue = styled.div`
  margin-top: 50px;
  margin-left: 50px;
  width: 171px;
  height: 18px;
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
  margin-top: 10px;
  margin-left: 50px;
  width: 171px;
  height: 18px;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;

const ImageTrue = styled.img`
  margin-top: 4px;
  margin-left: 35px;
  width: 200px;
  height: 140px;
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
`;

const Time = styled.div`
  margin-top: 10px;
  margin-left: 110px;
  width: 30px;
  height: 18px;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;

const Logout = styled.span`
  text-align: right;
  color: #ffffff;
  cursor: pointer;
  margin-left: 100px;
`;

const port = chrome.runtime.connect({
  name: "WaffleNote",
});

const Popup = ({ signOut, auth, getRecentNote }) => {
  const [curSlide, setCurSlide] = useState({});
  const [curState, setCurState] = useState(false);
  const [curTime, setCurTime] = useState('');
  const [noteId, setNoteId] = useState('');
  useEffect(() => {
    countTime();
    getNoteId().then((res) => {
      setCurSlide(res.slide_list[res.slide_list.length - 1]);
      setNoteId(res._id);
    });
    setInterval(async () => {
      countTime();
    }, 1000);
  }, []);

  const countTime = async () => {
    const startTime = await getStartTime();
    setCurTime(dateDiffToString(new Date(), new Date(startTime)));
  };


const port = chrome.runtime.connect({
  name: "WaffleNote",
});

  getState().then((state) => {
    setCurState(state);
  });

  const onClickLogout = async () => {
    await logout();
    signOut();
    window.location.reload();
    port.postMessage({ type: "waffleNoteStop", text: "stop" }, "*");

  };

  if (!noteId) {
    return (
      <PopupContainer>
        <div>
          <PopupHeader />
          <Logout onClick={onClickLogout}>로그아웃</Logout>
        </div>

        <PopupCircleLogo />
        <InfoFalse>현재 탭에서 강의를 듣고 계신가요?</InfoFalse>
        <CaptureButton />
        <PopupFooter />
      </PopupContainer>
    );
  }

  return (
    <PopupContainer>
      <div>
        <PopupHeader />
        <Logout onClick={onClickLogout}>로그아웃</Logout>
      </div>
      {curSlide.id}
      {curState ? (
        <>
          <InfoTrue>현재 슬라이드</InfoTrue>
          <ImageTrue src={'data:image/jpeg;base64,' + curSlide.smallImage} />
          <Time> {curTime} </Time>
          <StopButton />
          <Button to={`/notes/${noteId}/slides/1`} target="_blank">
            요약중인 노트보기
          </Button>{' '}
        </>
      ) : (
        <>
          <PopupCircleLogo />
          <InfoFalse>{`${auth.userId}님 안녕하세요.`}</InfoFalse>
          <InfoFalse>현재 탭에서 강의를 듣고 계신가요?</InfoFalse>
          <CaptureButton />
          <Button to={`/notes/${noteId}/slides/1`} target="_blank">
            와플노트 바로가기
          </Button>
        </>
      )}
      <PopupFooter />
    </PopupContainer>
  );
};

function dateDiffToString(a, b) {
  let diff = Math.abs(a - b);

  let ms = diff % 1000;
  diff = (diff - ms) / 1000;
  let ss = diff % 60;
  diff = (diff - ss) / 60;
  let mm = diff % 60;
  diff = (diff - mm) / 60;
  let hh = diff % 24;

  if (ss < 10) ss = '0' + ss;
  if (mm < 10) mm = '0' + mm;
  if (hh < 10) hh = '0' + hh;

  return hh + ':' + mm + ':' + ss;
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps, { signOut })(Popup);
