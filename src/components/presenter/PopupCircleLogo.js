import React from 'react';
import styled from 'styled-components';
import WaffleCircle from '../../static/WaffleCircle.png';

const Circle = styled.img`
  width: 120px;
  height: 120px;
  margin: 0 auto;
  margin-top: 32px;
  margin-bottom: 12px;
  
  object-fit: contain;
`;

const PopupCircleLogo = () => {
  return (
    <>
      <Circle src={WaffleCircle} />
    </>
  )
}
export default PopupCircleLogo;
