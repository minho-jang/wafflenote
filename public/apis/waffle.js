const DEV_SERVER = 'http://localhost:3001'
const PROD_SERVER = null //TODO: Add production server

export default axios.create({
  baseURL: PROD_SERVER || DEV_SERVER,
});
