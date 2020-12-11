import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TextArea = styled.span`
  margin: 0 0 24px 0;
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
  display: block;
`;

const SentenceLank = (props) => {
  const [text, setText] = useState([]);
  const inputText = props.input
    ? props.input
    : ["처리중", "처리중", "처리중", "처리중", "처리중"];
  useEffect(() => {
    setText(inputText);
  }, [props.input]);

  const renderText = (text) => {
    const result = text.map((element) => (
      <li key={element.toString()}>{element}</li>
    ));
    return <ul>{result}</ul>;
  };
  return (
    <div>
      <TextArea>{renderText(text)}</TextArea>
    </div>
  );
};

export default SentenceLank;
