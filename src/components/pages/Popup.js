import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import CaptureButton from '../../CaptureButton';
import { getLastCapturedImage } from '../../apis/storage';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  height: 430px;
  align-items: center;
`;

const Image = styled.img`
  margin: 10px;
  width: 90%;
  height: 40%;
`;

const Popup = () => {
  const [curSlide, setCurSlide] = useState({});
  useEffect(() => {
    setImage();
    setInterval(async () => {
      setImage();
    }, 2000);
  }, []);

  const setImage = async () => {
    const response = await getLastCapturedImage('data');
    setCurSlide(response.data);
  };

  return (
    <Container>
      {console.log(curSlide)}
      {curSlide.id}
      <Image src={curSlide.image} />
      <Link to="/notes/1" target="_blank" className="ui button">
        Go to classroom
      </Link>
      <CaptureButton />
    </Container>
  );
};

export default Popup;
