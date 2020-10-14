import React, { useEffect, useState } from 'react';
import styled, { css }  from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSlides } from '../../actions/slides';
import { Icon } from 'semantic-ui-react';

const Wrapper = styled.div`
  height: 90vh;
  width: 356px;
  position: relative;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
`;
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

const ResultButton = styled.div`
  width: 336px;
  height: 44px;
  border-radius: 20px;
  background-color: #fdeed0;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.45;
  letter-spacing: normal;
  text-align: center;
  color: #fbb93a;
  font-size: 20px;
  padding-top: 10px;
  a {
    width: 336px;
    color: #fbb93a;
    display: block;
  }
  cursor: pointer;
`;

const RefreshIcon = styled(Icon)`
  padding-right: 30px;
  padding-bottom: 25px;
  float: right;
  cursor: pointer;
`


const LoadingIcon = styled(Icon)`
  padding-right: 30px;
  padding-bottom: 25px;
  float: right;
`

const SlideList = (props) => {
  const [clickedRefresh, toggleRefresh] = useState(false);
  useEffect(() => {
    props.getSlides(props.noteId);
  }, []);
  const renderedList = (arr) =>
    arr.map((item, index) => {
      const isSelected = item.slide_id === props.id-0 ? true : false;
      return (
        <Link to={`/notes/${props.noteId}/slides/${index + 1}`}>
          <SlideCard isSelected= {isSelected}>
            <SlideImage src={'data:image/jpeg;base64,' + item.smallImage} />
            <SlideContent>
              <SlideTitle>{item.title}</SlideTitle>
              <div>
                <span>{item.endTime !== null ? item.startTime + ' ~ ' + item.endTime + ' ' : item.startTime + ' ~ '}</span>
                <span>{item.tags.slice(0, 4).join(',')}</span>
              </div>
              <SlideScript>{item.script}</SlideScript>
            </SlideContent>
          </SlideCard>
        </Link>
      );
    });

    useEffect(() => {
      toggleRefresh(false);
    }, [props]);
  const onClickRefresh = () => {
    toggleRefresh(true);
    props.getSlides(props.noteId);
  }
  return (
    <Wrapper>
      {clickedRefresh ?
        <LoadingIcon name="spinner" /> :
        <RefreshIcon name="refresh" onClick={onClickRefresh} size="large" color="yellow" />}
      <div>{props.slides ? renderedList(props.slides) : ''}</div>
      <ResultButton>
        <Link to={`/notes/${props.noteId}/result`}>결과</Link>
      </ResultButton>
    </Wrapper>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    slides: Object.values(state.slides),
    note: state.notes[ownProps.noteId],
  };
};

export default connect(mapStateToProps, { getSlides })(SlideList);
