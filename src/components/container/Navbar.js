import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import waffle from '../../static/WaffleLogo.png';
import menuIcon from '../../static/Menu.png';
import UserDropdown from './UserDropdown';
import Spinner from '../presenter/Spinner';
import { checkAuth } from '../../actions/auth';

const Wrapper = styled.div`
  height: 64px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #fbb93a;
`
const Container = styled.div`
  width: 1300px;
  margin: auto;
  padding: 15px 0;
`
const ItemRight = styled.div`
  float: right;
`
const MenuIcon = styled.img`
  height: 23px;
  margin-top: 3px;
`
const WaffleLogo = styled.img`
`

const Navbar = ({ auth, checkAuth }) => {

  useEffect(() => {
    checkAuth()
  }, [])
  if (auth.isSignedIn == null) {
    return <Spinner />
  }
  if (!auth.isSignedIn) {
    return <Redirect to="/login" />
  }
  return (
  <Wrapper>
    <Container>
      <WaffleLogo src={waffle} />

      <ItemRight>
        <UserDropdown />
      </ItemRight>
    </Container>
  </Wrapper>
)};


const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps, { checkAuth })(Navbar);
