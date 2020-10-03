import axios from 'axios';

export default axios.create({
  baseURL: process.env.BASE_URL || 'http://13.124.80.162:3000',
});
