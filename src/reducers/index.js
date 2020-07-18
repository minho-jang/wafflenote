import { combineReducers } from 'redux';
import slideReducer from './slideReducer';

export default combineReducers({ slides: slideReducer });
