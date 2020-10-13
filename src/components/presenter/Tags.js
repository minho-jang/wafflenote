
import React from 'react';
import styled from 'styled-components';

const Tag = styled.button`
  border-radius: 20px;
  margin: 0 7px;
  text-align: center;
  font-size: 20px;
  background-color: #fdeed0;
  width: 106px;
  height: 59px;
  border: 0;
  outline: 0;
  color: #b3b3b3;

  cursor: pointer;
`;

const Tags = ({ tags }) => {
  const renderTags = (tags) => tags.slice(0,5).map((item) => {
    return <>
      <Tag>{"#" + item}</Tag>
    </>
  })

  return <div>
    {renderTags(tags)}
  </div>
}
export default Tags;