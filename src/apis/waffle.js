import axios from 'axios';

const waffle = axios.create({
  baseURL: process.env.BASE_URL || 'http://13.124.80.162:3000',
});
waffle.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error.response.status == 401) {
      window.open("popup.html#/login", "_self")
      return error
    }
  },
);
export {waffle};