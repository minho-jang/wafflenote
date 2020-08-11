import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import SlideList from '../modules/SlideList';
import { getSlides } from '../../actions/slides';
import TitleText from '../ui/TitleText';
import Navbar from '../modules/Navbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 450px;
  margin-top: 100px;
`;

const Image = styled.img`
  width: 700px;
  height: auto;
`;

const Note = (props) => {
  useEffect(() => {
    props.getSlides();
  }, []);

  const renderedBody = (cur) => {
    return (
      <>
        <TitleText>Slide {cur.id + 1}</TitleText>
        <Image src={cur.slide} />
      </>
    );
  };
  return (
    <React.Fragment>
      <Navbar />
      <SlideList />
      <Wrapper>
        {props.slides && props.slides.length !== 0 ? renderedBody(props.slides[props.match.params.id - 1]) : ''}
      </Wrapper>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    slides: Object.values(state.slides),
  };
};

export default connect(mapStateToProps, { getSlides })(Note);
