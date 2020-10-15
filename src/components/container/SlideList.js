import React, { useEffect, useState } from 'react';
import styled, { css }  from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSlides } from '../../actions/slides';
import { Icon } from 'semantic-ui-react';
import SlideItem from './SlideItem';

const Wrapper = styled.div`
  height: 90vh;
  width: 356px;
  position: relative;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
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
  position: relative;
  top: 5px;
  right: 10px;
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
          <SlideItem isSelected= {isSelected} item={item} />
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
        <LoadingIcon loading name="spinner" size="large" /> :
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
