import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { connect} from 'react-redux';
import styled from 'styled-components';

import GoogleIcon from '../../static/GoogleIcon.png';
import { signIn, signOut } from '../../actions/auth';
import { login } from '../../apis/utils'
import Spinner from '../presenter/Spinner';

const Form = styled.form`

`
const Input = styled.input`
  width: 200px;
  height: 24px;
  border-radius: 18px;
  border: 0;
  outline: 0;
  margin: 5px auto;
  background-color: #ffffff;
  padding-left: 17px;
  ::placeholder,
  ::-webkit-input-placeholder {
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: left;
    color: #ffbc3e;
  }
`
const LoginButton = styled.button`
  width: 200px;
  height: 24px;
  border-radius: 18px;
  border: 0;
  outline: 0;
  margin: 5px auto;
  background-color: #fdeed0;
  text-align: center;
  color: #959595;
  font-size: 12px;
`

const LoginForm = ({ auth, signIn, location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRequested, toggleRequest] = useState(false);
  const history = useHistory();

  const handleClick = () => {
    try {
      toggleRequest(true);
      login(email, password)
        .then((res) => {
          if (res) {
            signIn(res.whoami);
          } else {
            alert('로그인 정보가 올바르지 않습니다.');
          }
          toggleRequest(false);
        })
    } catch (e) {
      alert('로그인 정보가 올바르지 않습니다.');
      setEmail('');
      setPassword('');
    }
  };
  if (auth.isSignedIn) {
    history.goBack();
  }
  if (isRequested) {
    return <Spinner />
  }

  
  const googleClick = () => {
    alert('현재 Google Login을 이용하실 수 없습니다.')
  }

  return (
    <>
        <Input value={email} onChange={({ target: { value } }) => setEmail(value)} type="text" placeholder="이메일" />
        <Input value={password} onKeyPress={(e) => { e.key==='Enter' || e.keyCode === 13 ? handleClick() : ""}} onChange={({ target: { value } }) => setPassword(value)} type="password" placeholder="비밀번호" />
        <LoginButton onClick={handleClick}>로그인</LoginButton>
        <LoginButton onClick={googleClick}>
          <img src={GoogleIcon} style ={{ verticalAlign: "middle" }}/>
          Google로 로그인
        </LoginButton>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}
export default connect(mapStateToProps, { signIn })(LoginForm);
