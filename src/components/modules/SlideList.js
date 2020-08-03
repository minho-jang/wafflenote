import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getSlides, setSlide } from '../../actions/slides';

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
    props.setSlide();
    props.getSlides();
  }, []);

  if (props.slides == null) {
    return <div>asd</div>;
  } else {
    console.log(props.slides)
  }
  const renderedList = (arr) => arr.map((item, index) => {
  
    return (
      <div class="item">
        <div class="ui tiny image">
          <img src="https://react.semantic-ui.com/images/wireframe/image.png" />
        </div>
        <div class="content">
          <div class="header">Slide {index+1}</div>
          <div class="meta">
            <span class="price">time info</span>
            <span class="stay">#keyword</span>
          </div>
          <div class="description">
            <p>description</p>
          </div>
        </div>
      </div>
    );
  })

  return (
    <Wrapper>
      <div className="ui divided items">
        {renderedList([1,2,3,4,5,6,7,8,9,10])}
      </div>
    </Wrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    slides: Object.values(state.slides),
  }
}

export default connect(mapStateToProps, { getSlides, setSlide })(SlideList);
