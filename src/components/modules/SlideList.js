import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { getSlides } from '../../actions/slides';

const Wrapper = styled.div`
  height: 100%;
  width: 400px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  padding-top: 20px;
  padding-bottom: 50px;
  padding-left: 10px;
  margin-top: 40px;
  border: 1px ridge darkgray;
`;

const SlideList = (props) => {
  useEffect(() => {
    props.getSlides();
    setInterval(() => {
      props.getSlides();
    }, 3000)
  }, []);
  const renderedList = (arr) => arr.map((item, index) => {
    return (
      <Link to={`${index+1}`} class="item">
        <div class="ui tiny image">
          <img src={item.slide} />
        </div>
        <div class="content">
          <div class="header">Slide {index+1}</div>
          <div class="meta">
            <span class="price">time info</span>
            <span class="stay">#keyword</span>
          </div>
          <div class="description">
            <p>{item.script}</p>
          </div>
        </div>
      </Link>
    );
  })

  return (
    <Wrapper>
      <div className="ui divided items">
        {props.slides ? renderedList(props.slides) : ""}
      </div>
    </Wrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    slides: Object.values(state.slides),
  }
}

export default connect(mapStateToProps, { getSlides })(SlideList);
