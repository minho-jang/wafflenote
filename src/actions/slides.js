import waffle from '../apis/waffle';
import { GET_SLIDES, GET_SLIDE, EDIT_SLIDE } from './types';

export const getSlides = () => async (dispatch) => {
  // TODO(DONGCHEOL): Add getting data from local storage
  const response = await waffle.get('/slides');

  dispatch({ type: GET_SLIDES, payload: response.data });
};

export const getSlide = (id) => async (dispatch) => {
  const response = await waffle.get(`/slides/${id}`);

  dispatch({ type: GET_SLIDE, payload: response.data });
};

export const editSlide = (id, formValues) => async (dispatch) => {
  const response = await waffle.put(`/slides/${id}`, formValues);

  dispatch({ type: EDIT_SLIDE, payload: response.data });
};
