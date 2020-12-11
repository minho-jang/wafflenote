import _ from 'lodash';
import { GET_SLIDES, GET_SLIDE, EDIT_SLIDE } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_SLIDES:
      return { ...state, ..._.mapKeys(action.payload, 'slide_id') };
    case GET_SLIDE:
      return { ...state, [action.payload.slide_id]: action.payload };
    case EDIT_SLIDE:
      return { ...state, [action.payload.slide_id]: action.payload };
    default :
      return state;
  }
};
