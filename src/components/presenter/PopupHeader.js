import React, { useEffect } from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
import { checkAuth } from '../../actions/auth';
import { WAFFLE_HOME } from '../../actions/types';
import WaffleLogo from '../../static/WaffleLogo.png';
import Spinner from './Spinner';

const Logo = styled.img`
  width: 103px;
  height: 16px;
  margin-top: 12px;
  margin-left: 11px;
  cursor: pointer;
`;

const PopupHeader = ({ auth, checkAuth }) => {
  
  useEffect(() => {
    checkAuth()
  }, [])

  if (auth.isSignedIn == false) {
    return <Redirect to="/login" />
  }
  if (auth.isSignedIn == null) {
    return <Spinner />
  }
  return <Logo src={WaffleLogo} onClick={() => window.open(WAFFLE_HOME, '_blank')} />
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps,{ checkAuth })(PopupHeader)