const DEV_SERVER = 'http://localhost:3001'
const PROD_SERVER = 'http://13.125.209.214:3000' //TODO: Add production server

export default axios.create({
  baseURL: DEV_SERVER,
});
