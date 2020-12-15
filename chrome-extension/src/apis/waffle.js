import axios from 'axios';

const waffle = axios.create({
  baseURL: process.env.BASE_URL || 'http://3.35.170.137:3000',
});
export {waffle};
