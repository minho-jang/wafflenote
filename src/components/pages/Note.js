import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import SlideList from "../modules/SlideList";
import { getSlide } from "../../actions/slides";
import Navbar from "../modules/Navbar";
import MainBoard from "../modules/MainBoard";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 1300px;
  margin: 30px auto;
`;
const Note = (props) => {

  return (
    <React.Fragment>
      <Navbar />
      <Wrapper>
        <SlideList />
        <MainBoard id={props.match.params.id} />
      </Wrapper>
    </React.Fragment>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    slide: state.slides[ownProps.match.params.id],
  };
};

export default connect(mapStateToProps, { getSlide })(Note);
