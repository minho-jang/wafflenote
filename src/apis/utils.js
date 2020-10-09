import { getSlidesFromStorage } from './storage';
import waffle from './waffle';

export const getResult = async () => {
  const response = await getSlidesFromStorage('note');
  let text = '';
  response.forEach((item) => {
    if (item.script) {
      text = text + item.script;
    }
  });
  const res = {};
  try {
    const response = await waffle.post('/api/nlp/summarization', {
      text,
    }, {
      header: { 'Content-Type': 'application/json' }
    });
    res.summary = response.data.result.summary;
  } catch (error) {
    console.log(error);
    res.summary = text;
  }
  try {
    const response = await waffle.post('/api/nlp/keyword-extraction', {
      text,
    }, {
      header: { 'Content-Type': 'application/json' }
    });
    res.keywords = response.data.result.keywords;
  } catch (error) {
    console.log(error)
  }
  return res;
};
