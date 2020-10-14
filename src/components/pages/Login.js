import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import PopupContainer from '../presenter/PopupContainer';
import PopupHeader from '../presenter/PopupHeader';
import PopupCircleLogo from '../presenter/PopupCircleLogo';
import PopupInfo from '../presenter/PopupInfo';

import WaffleLogo from '../../static/WaffleLogo.png';
import LoginForm from '../container/LoginForm';
import { WAFFLE_HOME } from '../../actions/types';

const HomeLinks = styled.div`
  width: 200px;
  margin: 19px auto;
  text-align: center;
`

const HomeLink = styled.a`
  font-size: 10px;
  margin: 0 7px;
  color: white;
`
const Login = (props) => {
  return (
    <PopupContainer>
      <PopupHeader />
      <PopupCircleLogo />
      <PopupInfo> 환영합니다! </PopupInfo>
      <LoginForm />
      <HomeLinks>
        <HomeLink href={WAFFLE_HOME} target="_blank">아이디 찾기</HomeLink>
        <HomeLink href={WAFFLE_HOME} target="_blank">비밀번호 찾기</HomeLink>
        <HomeLink href={WAFFLE_HOME} target="_blank">회원가입</HomeLink>
      </HomeLinks>
    </PopupContainer>
  )
}

export default Login;

