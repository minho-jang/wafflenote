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
    const result = await waffle.post('/api/nlp/summarization', {
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        text,
      },
    });
    res.summary = result;
  } catch (error) {
    console.log(error)
    res.summary = text;
  }
  console.log(text)
  try {
    const keyword = await waffle.post('/api/nlp/keyword-extraction', {
      header: {
        'Content-Type': 'application/json', 
      },
      data: {
        text,
      },
    });
    console.log(keyword.result.keyword)
    res.keyword = keyword.result.keyword;
  } catch (error) {
    
  }
  return res
};
