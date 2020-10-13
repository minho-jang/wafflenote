import axios from 'axios';

const waffle = axios.create({
  baseURL: process.env.BASE_URL || 'http://13.124.80.162:3000',
});
waffle.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error)
    window.location.href = "popup.html#/login"
  },
);
export {waffle};