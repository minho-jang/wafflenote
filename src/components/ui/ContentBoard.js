import React, { useState, useEffect } from 'react';
import NormalText from '../ui/NormalText';
import styled from 'styled-components';

const TextArea = styled.textarea`
  margin: 24px 0;
  width: 805px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #b3b3b3;  
  border-style: none;
  border-color: Transparent;
  overflow: auto;
  outline: none;

`;
const ContentBoard = (props) => {
  const [isClicked, toggleClicked] = useState(false)
  const [text, setText] = useState("");
  const inputText = props.input;
  
  useEffect(() => {
    setText(inputText)
  }, [])
  const onClick = () => {
    console.log("ASD")
    toggleClicked(!isClicked);  
  }
  const onChange = (event) => {
    setText(event.target.value);
  }
  const onBlur = () => {
    toggleClicked(!isClicked);
  }
  return (
    <div>
      {isClicked ? 
        <TextArea value={text} onChange={onChange} onBlur={onBlur}/> : 
        <NormalText onClick={onClick}>{text}</NormalText>
      }
    </div>
  );
}

export default ContentBoard