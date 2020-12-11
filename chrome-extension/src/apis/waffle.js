import axios from 'axios';

const waffle = axios.create({
  baseURL: process.env.BASE_URL || 'http://15.165.43.178:3000',
});
export {waffle};
