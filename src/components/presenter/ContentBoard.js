import React, { useState, useEffect } from 'react';
import NormalText from './NormalText';
import styled from 'styled-components';
import TextAreaAutosize from 'react-textarea-autosize';

const TextArea = styled(TextAreaAutosize)`
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
const MoreButton = styled.span`
  font-size: 14px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #fbb738;
`;

const ContentBoard = (props) => {
  const [isClicked, toggleClicked] = useState(false);
  const [text, setText] = useState('');
  const defaultText = `작성된 ${props.title}가 없습니다`;
  const inputText = props.input && props.input.trim() ? props.input : defaultText;
  useEffect(() => {
    setText(inputText);
  }, [props.input]);

  const onClick = () => {
    toggleClicked(!isClicked);
  };
  const onChange = (event) => {
    setText(event.target.value);
  };
  const onBlur = () => {
    if (text.trim() === '') setText(defaultText);
    toggleClicked(!isClicked);
    props.onBlur(text);
  };
  const renderText = (text) => {
    if (text.length >= 250) {
      const result = text.substr(0, 250);
      return (
        <>
          {result.split('\n').map((i) => (
            <>
              <br />
              {i}
            </>
          ))}
          <MoreButton>더 보기</MoreButton>
        </>
      );
    } else if (text.split('\n').length >= 3) {
      const result = text.split('\n').map((item, index) => {
        if (index < 3) {
          return (
            <>
              <br /> {item}
            </>
          );
        } else return '';
      });
      return (
        <>
          {result}
          <MoreButton> 더 보기</MoreButton>
        </>
      );
    } else {
      return (
        <>
          {text.split('\n').map((i) => (
            <>
              <br />
              {i}
            </>
          ))}
        </>
      );
    }
  };
  return (
    <div>
      {isClicked ? (
        <TextArea spellcheck="false" value={text} onChange={onChange} onBlur={onBlur} autoFocus />
      ) : (
        <>
          <NormalText onClick={onClick} placeholder={defaultText}>
            {renderText(text)}
          </NormalText>
        </>
      )}
    </div>
  );
};

export default ContentBoard;
