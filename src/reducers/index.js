import { combineReducers } from 'redux';
import slideReducer from './slideReducer';
import noteReducer from './noteReducer';
import authReducer from './authReducer';

export default combineReducers({ slides: slideReducer, notes: noteReducer, auth: authReducer });
