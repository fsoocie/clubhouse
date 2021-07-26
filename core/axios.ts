import Axios from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();
const instance = Axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    Authorization: 'Bearer ' + cookies?.token,
  },
});

export default instance;
