const axios = require("axios");

const NLP_SERVER_URL = require("../../config/endpoint.json").NLP_BASE_URL;

const getKeywords = (text) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: NLP_SERVER_URL + "/keyword-extraction", 
      data: {
        text 
      },
    })
    .then((response) => {
      resolve(response);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

const getSummary = (text, numSummaries) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: NLP_SERVER_URL + "/summarization", 
      data: {
        text: text,
        num: numSummaries
      },
    })
    .then((response) => {
      if (response.data.error) {
	console.log(response.data.error);
      } 
      resolve(response);
      
    })
    .catch((err) => {
      reject(err);
    });
  });
}

module.exports = {
  getSummary: getSummary,
  getKeywords: getKeywords
}
