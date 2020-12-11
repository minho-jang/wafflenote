import { waffle } from '../apis/waffle';
import { errorHandler } from '../apis/utils';

import { SIGN_IN, SIGN_OUT } from './types';

export const signIn = (userId) => {
  return {
    type: SIGN_IN,
    payload: userId,
  };
};
export const signOut = () => {
  waffle.get('/signout');
  return {
    type: SIGN_OUT,
  };
};

export const checkAuth = () => async (dispatch) => {
  try {
    const response = await waffle.get('/user-info');
    dispatch({
      type: SIGN_IN,
      payload: response.data.name,
    });
  } catch (error) {
    errorHandler(error, dispatch);
  }
};
