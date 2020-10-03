import React, { useState, useEffect } from 'react';
import TitleText from './TitleText';
import styled from 'styled-components';

const TimeInfo = styled.span`
  text-align: right;
  float: right;
`;

const TitleBoard = ({ slide, onTitleSubmit }) => {
  const [isClicked, toggleClick] = useState(false);
  const [isHover, toggleHover] = useState(false);
  const [editedTitle, setTitle] = useState(slide.title); 
  const {title, endTimeInfo, startTimeInfo} = slide;
  useEffect(() => {
    toggleClick(false);
    setTitle(title);
  }, [slide])
  const onClick = () => {
    console.log("ASD")
    toggleClick(!isClicked);
  }

  const mouseOver = () => {
    toggleHover(true);
  }
  const mouseOut = () => {
    toggleHover(false);
  }

  const onInputChange = (e) => {
    setTitle(e.target.value);
  }
  const onSubmit = (e) => {
    onClick()
    e.preventDefault();
    onTitleSubmit(editedTitle);
  }

  if (isClicked) {
    return (
      <TitleText onMouseOver={mouseOver} onMouseOut={mouseOut}>
        <form style={{ display:"inline"}} onSubmit={onSubmit}>
          <input 
            placeholder="title" 
            value={editedTitle}
            onChange={onInputChange}
          />
          <button> save </button>
        </form>
        <TimeInfo>
          {endTimeInfo !== null ?
            " " + startTimeInfo + " ~ " + endTimeInfo : 
            " " +  startTimeInfo + " ~"}
        </TimeInfo>
      </TitleText>
    )
  }
  return (
    // diff between onMouseOver and onMouseEnter 
    <TitleText onMouseLeave={mouseOut} onMouseEnter={mouseOver}>
      {title ? title : "Slide"}
      {isHover && (<button onClick={onClick}> C </button>)}
      <TimeInfo>
        {endTimeInfo !== null ?
          " " + startTimeInfo + " ~ " + endTimeInfo : 
          " " +  startTimeInfo + " ~"}
      </TimeInfo>
    </TitleText>
  )
}

export default TitleBoard;