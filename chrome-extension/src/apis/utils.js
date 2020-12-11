import { getSlidesFromStorage } from './storage';
import { waffle } from './waffle';
import { Redirect } from 'react-router-dom';
import { SIGN_OUT } from '../actions/types';

export const errorHandler = (error, dispatch) => {
  if (!error.response) return
  if (error.response.status == 401) {
    dispatch({
      type: SIGN_OUT,
    })
  }
}

export const getNoteId = async () => {
  const response = await waffle.get(`/note/recently`);
  return response.data[0];
};

export const login = async (email, password) => {
  try {
    const response = await waffle.post('/signin', {
      type: 'wafflenote',
      wafflenote_id: email,
      password: password,
    });

    return response.data;
  } catch (error) {
    return false;
  }
};
export const logout = async () => {
  try {
    const response = await waffle.get('/signout');

    return true;
  } catch (error) {
    return false;
  }
}
export const getImage = async (slideId) => {
  const response = await waffle.get(`/slide/${slideId}/origin-image`, { responseType: 'blob' });
  const imageURL = URL.createObjectURL(response.data);
  return imageURL;
};
export const getImageBlob = async (slideId) => {
  const response = await waffle.get(`/slide/${slideId}/origin-image`, { responseType: 'blob' });
  return response.data;
};
export const getAudio = async (slideId) => {
  const response = await waffle.get(`/slide/${slideId}/audio`, { responseType: 'blob' });
  const audio = response.data;
  return audio;
};

export const getResult = async (noteId) => {
  const response = await waffle.get(`/note/${noteId}/result`);

  return response.data;
};
