import React from 'react';
import CaptureButton from '../../CaptureButton';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  width: 270px;
  height: 430px;
`
const Popup = () => {
  return (
    <Container>
      <Link to="/notes/1" className="item" target="_blank"> Go to classroom</Link>
      <CaptureButton>CaptureStart</CaptureButton>
    </Container>
  );
};

export default Popup;