const DEV_SERVER = 'http://localhost:3001'
const PROD_SERVER = 'http://13.124.80.162:3000' //TODO: Add production server

export default axios.create({
  baseURL: PROD_SERVER,
});
