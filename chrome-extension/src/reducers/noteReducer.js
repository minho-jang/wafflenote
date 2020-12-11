import _ from 'lodash';
import { GET_NOTES, GET_NOTE, EDIT_NOTE } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_NOTES:
      return { ...state, ..._.mapKeys(action.payload, '_id') };
    case GET_NOTE:
      return { ...state, [action.payload._id]: action.payload };
    case EDIT_NOTE:
      return { ...state, [action.payload._id]: action.payload };
    default :
      return state;
  }
};
