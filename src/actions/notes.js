import { waffle } from '../apis/waffle';
import { GET_NOTE, GET_NOTES, EDIT_NOTE } from './types';
import { getSlidesFromStorage, getOneSlideFromStorage, setSlideToStorage } from '../apis/storage';


export const getNotes = () => async (dispatch) => {
  const response = await waffle.get(`/note`);
  dispatch({ type: GET_NOTES, payload: response.data });
};

export const getNote = (noteId) => async (dispatch) => {
  const response = await waffle.get(`/note/${noteId}`);
  dispatch({ type: GET_NOTE, payload: response.data });
};

export const editNote = (noteId, noteTitle) => async (dispatch) => {
  const response = await waffle.post(`/note/${noteId}/title`, {
    title: noteTitle,
  });
  dispatch({ type: EDIT_NOTE, payload: response.data });
};

export const getRecentNote = () => async (dispatch) => {
  const response = await waffle.get(`/note/recently`);
  dispatch({ type: GET_NOTE, payload: response.data[0] });
}
