import React from 'react';
import { connect } from 'react-redux';
import SlideList from '../modules/SlideList';
import { getSlide } from '../../actions/slides';

const Note = (props) => {
  return (
    <React.Fragment>
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
