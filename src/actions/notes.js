import { waffle } from '../apis/waffle';
import { GET_NOTE, GET_NOTES, EDIT_NOTE, GET_NOTE_RESULT } from './types';
import { getSlidesFromStorage, getOneSlideFromStorage, setSlideToStorage } from '../apis/storage';
import { errorHandler } from '../apis/utils';

export const getNotes = () => async (dispatch) => {
  try {
    const response = await waffle.get(`/note`);
    dispatch({ type: GET_NOTES, payload: response.data });
  } catch (error) {
    errorHandler(error, dispatch);
  }
};

export const getNote = (noteId) => async (dispatch) => {
  try {
    const response = await waffle.get(`/note/${noteId}`);
    dispatch({ type: GET_NOTE, payload: response.data });
  } catch (error) {
    errorHandler(error, dispatch);
  }
};

export const getNoteResult = (noteId) => async (dispatch) => {
  try {
    const response = await waffle.get(`/note/${noteId}/result`);
    dispatch({ type: GET_NOTE_RESULT, payload: response.data });
  } catch (error) {
    errorHandler(error, dispatch);
  }
};

export const editNote = (noteId, noteTitle) => async (dispatch) => {
  try {
    const response = await waffle.post(`/note/${noteId}/title`, {
      title: noteTitle,
    });
    dispatch({ type: EDIT_NOTE, payload: response.data });
  } catch (error) {
    errorHandler(error, dispatch);
  }
};

export const getRecentNote = () => async (dispatch) => {
  try {
    const response = await waffle.get(`/note/recently`);
    dispatch({ type: GET_NOTE, payload: response.data[0] });
  } catch (error) {
    errorHandler(error, dispatch);
  }
};
