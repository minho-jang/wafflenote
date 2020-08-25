import waffle from '../apis/waffle';
import { GET_SLIDES, GET_SLIDE, EDIT_SLIDE } from './types';
import { getSlidesFromStorage, getOneSlideFromStorage, setSlideToStorage } from '../apis/storage';

export const getSlides = () => async (dispatch) => {
  // TODO(DONGCHEOL): Add getting data from local storage
  const response = await getSlidesFromStorage('note');
  dispatch({ type: GET_SLIDES, payload: response });
};

export const editSlide = (index, slide) => async (dispatch) => {
  
  await setSlideToStorage('note', index, slide); // FOR TESTING
  
  dispatch({ type: EDIT_SLIDE, payload: slide });
};

export const getSlide = (index) => async (dispatch) => {
  const response = await getOneSlideFromStorage('note', index);
  dispatch({ type: GET_SLIDE, payload: response });
};

