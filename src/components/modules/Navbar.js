import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import waffle from '../../static/WaffleLogo.png';
import menuIcon from '../../static/Menu.png';

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

const Navbar = () => (
  <Wrapper>
    <Container>
      <WaffleLogo src={waffle} />

      <ItemRight>
        <MenuIcon src={menuIcon} />
      </ItemRight>
    </Container>
  </Wrapper>
);

export default Navbar;
