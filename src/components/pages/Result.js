import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import SlideList from "../container/SlideList";
import { getSlide } from "../../actions/slides";
import Navbar from "../container/Navbar";
import ResultBoard from "../container/ResultBoard";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 1300px;
  margin: 30px auto;
`;
const Result = (props) => {

  return (
    <React.Fragment>
      <Navbar />
      <Wrapper>
        <SlideList />
        <ResultBoard/>
      </Wrapper>
    </React.Fragment>
  );
};

export default Result;
