import React from 'react';
import styled from 'styled-components';
import { WAFFLE_HOME } from '../../actions/types';
import WaffleLogo from '../../static/WaffleLogo.png';

const Logo = styled.img`
  width: 103px;
  height: 16px;
  margin-top: 12px;
  margin-left: 11px;
  cursor: pointer;
`;

const PopupHeader = () => {
  return <Logo src={WaffleLogo} onClick={() => window.open(WAFFLE_HOME, '_blank')} />
}
export default PopupHeader