import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Icon } from 'semantic-ui-react';

const DeleteIcon = styled(Icon)`
  position: relative;
  font-size: 20px;
  color: #9b9b9b;
  margin-left: -100px;
  top: 10px;
  left: 170px;
  cursor:pointer;
`

const SlideCard = styled.div`
  width: 336px;
  height: 132px;
  border-radius: 20px;

  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #ffbc3e;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  ${(props) =>
    props.isSelected &&
    css`
      background-color: #fdeed0;
    `}
  transition: all ease 0.5s 0s;
  :hover {
    background-color: #fdeed0;
  }
`;
const SlideImage = styled.img`
  width: 89.5px;
  height: 89.5px;
  margin: 20.5px;
`;
const SlideContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20.5px 0;
  margin-right: 30.5px;
  color: #b3b3b3;
`;
const SlideTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.45;
  letter-spacing: normal;
  color: #9b9b9b;
`;
const SlideScript = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  line-height: 1.2em;
  height: 2.4em;
`;

const SlideItem = ({ isSelected, item }) => {
  const [isHover, toggleHover] = useState(false);
  const mouseOver = () => {
    toggleHover(true);
  };
  const mouseOut = () => {
    toggleHover(false);
  };

  return (
    <>
      <SlideCard isSelected={isSelected} onMouseLeave={mouseOut} onMouseEnter={mouseOver}>

        <SlideImage src={'data:image/jpeg;base64,' + item.smallImage} />

        {/* {isHover && <DeleteIcon name="delete" size="large" color="yellow" />} */}
        <SlideContent>

          <SlideTitle>{item.title} 
          </SlideTitle>
          <div>

            <span>{item.endTime !== null ? item.startTime + ' ~ ' + item.endTime + ' ' : item.startTime + ' ~ '}</span>
            <span>{item.tags.slice(0, 4).join(',')}</span>
          </div>
          <SlideScript>{item.script}</SlideScript>
        </SlideContent>

      </SlideCard>
    </>
  );
};

export default SlideItem;
