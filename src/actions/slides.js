import waffle from '../apis/waffle';
import { GET_SLIDES, GET_SLIDE, EDIT_SLIDE } from './types';
import { getSlidesFromStorage, getOneSlideFromStorage, setSlideToStorage } from '../apis/storage';

export const getSlides = () => async (dispatch) => {
  // TODO(DONGCHEOL): Add getting data from local storage
  const response = await getSlidesFromStorage('note');
  dispatch({ type: GET_SLIDES, payload: response });
};

export const setSlide = () => async (dispatch) => {
  // TODO(DONGCHEOL): Add getting data from local storage
  const response = await getSlidesFromStorage('slide');
  
  await setSlideToStorage('slide', { id: 1, description: "test" }); // FOR TESTING
  
  dispatch({ type: GET_SLIDES, payload: [{ id: 1, description: "test1" }] });
};

export const getSlide = (index) => async (dispatch) => {
  const response = await getOneSlideFromStorage('note', index);

  dispatch({ type: GET_SLIDE, payload: response.data });
};

export const editSlide = (id, formValues) => async (dispatch) => {
  const response = await waffle.put(`/slides/${id}`, formValues);

  dispatch({ type: EDIT_SLIDE, payload: response.data });
};
