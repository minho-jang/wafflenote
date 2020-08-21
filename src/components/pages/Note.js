import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import SlideList from '../modules/SlideList';
import { getSlides } from '../../actions/slides';
import TitleText from '../ui/TitleText';
import Navbar from '../modules/Navbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 1300px;
  margin: 30px auto;
`;
const Image = styled.img`
  width: 700px;
  height: auto;
`;
const Body = styled.div`
  margin: 0 auto;
`
const Note = (props) => {
  useEffect(() => {
    props.getSlides();
  }, []);

  const renderedBody = (cur) => {
    return (
      <Body>
        <TitleText>{cur.title}</TitleText>
        <Image src={cur.slide} />
        {/* {cur.script} */}
      </Body>
    );
  };
  return (
    <React.Fragment>
      <Navbar />
      <Wrapper>
        <SlideList />
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
