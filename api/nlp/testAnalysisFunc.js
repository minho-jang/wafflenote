const axios = require("axios");

const NLP_SERVER_URL = "http://localhost:5001";

const getKeywords = async (text) => {
  return axios({
    method: 'post',
    url: NLP_SERVER_URL + "/keyword-extraction", 
    data: {
      text 
    },
  });
}

const getSummary = (text, numSummaries) => {
  return axios({
    method: 'post',
    url: NLP_SERVER_URL + "/summarization", 
    data: {
      text: text,
      num: numSummaries
    },
  });
}

module.exports = {
  getSummary: getSummary,
  getKeywords: getKeywords
}
