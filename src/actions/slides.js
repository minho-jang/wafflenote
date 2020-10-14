import { waffle } from '../apis/waffle';
import { GET_SLIDES, GET_SLIDE, EDIT_SLIDE } from './types';
import { errorHandler } from '../apis/utils';

export const getSlides = (noteId) => async (dispatch) => {
  try {
    const response = await waffle.get(`/slide/all/${noteId}`);
    dispatch({ type: GET_SLIDES, payload: response.data });
  } catch (error) {
    errorHandler(error, dispatch);
  }
};

export const getSlide = (slideId) => async (dispatch) => {
  try {
    const response = await waffle.get(`/slide/${slideId}`);
    dispatch({ type: GET_SLIDE, payload: response.data });
  } catch (error) {
    errorHandler(error, dispatch);
  }
};

export const editSlide = (slideId, slide) => async (dispatch) => {
  try {
    const response = await waffle.post(`slide/${slideId}/replace`, slide); // FOR TESTING
    dispatch({ type: EDIT_SLIDE, payload: slide });
  } catch (error) {
    errorHandler(error, dispatch);
  }
};
