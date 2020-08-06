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
  const [curImage, setCurImage] = useState('');

  useEffect(() => {
    setImage();
    setInterval(async () => {
      setImage();
    }, 2000);
  }, []);

  const setImage = async () => {
    const imageSrc = await getLastCapturedImage('image');
    setCurImage(imageSrc.image);
  };

  return (
    <Container>
      <Image src={curImage} />
      <Link to="/notes/1" target="_blank" className="ui button">
        Go to classroom
      </Link>
      <CaptureButton />
    </Container>
  );
};

export default Popup;
