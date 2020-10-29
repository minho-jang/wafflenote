/** 
 * note 관련 DB 함수
*/

const Note = require("../../models/note").Note;
const ObjectId = require("mongoose").Types.ObjectId;

const getNoteFullText = (noteid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Note.findById(noteid); 
      const slideList = doc.slide_list;
      let text = "";
      for (var i = 0; i < slideList.length; i++) {
        text = text.concat(slideList[i].script);
      }
      resolve(text);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

const getSlideIdByIndex = (noteid, idx) => {
  return new Promise((resolve, reject) => {
    Note.aggregate([
      {$match: {_id: new ObjectId(noteid)}},
      {$project: {theSlide: {$arrayElemAt: ['$slide_list', idx]}}}
    ])
    .then(result => {
      resolve(result[0].theSlide._id);
    })
    .catch(err => {
      console.log(err);
      reject(err);
    }); 
  });
}

const getSlideListLength = (noteid) => {
  return new Promise((resolve, reject) => {
    Note.aggregate([
      {$match: {_id: new ObjectId(noteid)}},
      {$project: {length: {$size: "$slide_list"}}}
    ])
    .then(result => {
      resolve(result[0].length);
    })
    .catch(err => {
      console.log(err);
      reject(err);
    });
  });
}

module.exports = {
  getNoteFullText,
  getSlideIdByIndex,
  getSlideListLength
}