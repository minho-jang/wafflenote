import React from 'react';
import styled from 'styled-components';
import { WAFFLE_HOME } from '../../actions/types';

const HomeLinks = styled.div`
  width: 200px;
  margin: 19px auto;
  text-align: center;
`;

const HomeLink = styled.a`
  font-size: 10px;
  margin: 0 7px;
  color: white;
`;

const PopupFooter = () => {
  return (
    <>
      <HomeLinks>
        <HomeLink href={WAFFLE_HOME} target="_blank">
          개인정보 처리방침
        </HomeLink>
        <HomeLink href={WAFFLE_HOME} target="_blank">
          회원정보 변경
        </HomeLink>
      </HomeLinks>
    </>
  );
};

export default PopupFooter;
