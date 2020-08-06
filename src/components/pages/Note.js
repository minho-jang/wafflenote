import React from 'react';
import { connect } from 'react-redux';
import SlideList from '../modules/SlideList';
import { getSlide } from '../../actions/slides';
import Navbar from '../modules/Navbar';

const Note = (props) => {
  return (
    <React.Fragment>
      <Navbar />
      <SlideList />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    slides: Object.values(state.slides),
  };
};

export default connect(mapStateToProps, { getSlide })(Note);
