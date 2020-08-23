import React from 'react';
import styled from 'styled-components';
import TitleText from '../ui/TitleText';
import NormalText from '../ui/NormalText';
import ContentBoard from '../ui/ContentBoard';

const Body = styled.div`
  margin: 0 auto;
`
const Image = styled.img`
  width: 700px;
  height: auto;
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
`;

const MainBoard = (props) => {
  if (!props.curSlide) {
    return (
      <div>
        Loading
      </div>
    )
  }
  const curSlide = props.curSlide;
  return (
    <Body>
      <TitleText>
        {curSlide.title}
      </TitleText>
      <Image src={curSlide.slide} />
      <TitleText>
        스크립트
      </TitleText>
      <NormalText>
        {curSlide.script}
      </NormalText>
      <TitleText>
        노트
      </TitleText>
      <ContentBoard input={curSlide.script} />
      <TitleText>
        태그
      </TitleText>
    </Body>
  );
}

export default MainBoard;