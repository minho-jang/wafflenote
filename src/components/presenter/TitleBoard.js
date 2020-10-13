import React, { useState, useEffect } from 'react';
import TitleText from './TitleText';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

const TimeInfo = styled.span`
  text-align: right;
  float: right;
`;

const EditButton = styled(Icon)`
  cursor: pointer;
`;
const SaveButton = styled.button`
  margin-left: 10px;

  cursor: pointer;
`;

const TitleBoard = ({ slide, onTitleSubmit }) => {
  const [isClicked, toggleClick] = useState(false);
  const [isHover, toggleHover] = useState(false);
  const [editedTitle, setTitle] = useState(slide.title);
  const { title, endTime, startTime } = slide;
  useEffect(() => {
    toggleClick(false);
    setTitle(title);
  }, [slide]);
  const onClick = () => {
    toggleClick(!isClicked);
  };

  const mouseOver = () => {
    toggleHover(true);
  };
  const mouseOut = () => {
    toggleHover(false);
  };

  const onInputChange = (e) => {
    setTitle(e.target.value);
  };
  const onSubmit = (e) => {
    onClick();
    e.preventDefault();
    onTitleSubmit(editedTitle);
  };

  if (isClicked) {
    return (
      <TitleText onMouseOver={mouseOver} onMouseOut={mouseOut}>
        <form style={{ display: 'inline' }} onSubmit={onSubmit}>
          <input placeholder="title" value={editedTitle} onChange={onInputChange} />
          <SaveButton> 저장 </SaveButton>
        </form>
        {startTime && <TimeInfo>{endTime !== null ? ' ' + startTime + ' ~ ' + endTime : ' ' + startTime + ' ~'}</TimeInfo>}
      </TitleText>
    );
  }
  return (
    // diff between onMouseOver and onMouseEnter
    <TitleText onMouseLeave={mouseOut} onMouseEnter={mouseOver}>
      {title ? title + '  ' : 'Slide'}
      {isHover && <EditButton name="edit outline" size='small' onClick={onClick}></EditButton>}
      {startTime && <TimeInfo>{endTime !== null ? ' ' + startTime + ' ~ ' + endTime : ' ' + startTime + ' ~'}</TimeInfo>}
    </TitleText>
  );
};

export default TitleBoard;
