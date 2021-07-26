import Axios from 'axios';
import Cookie from 'js-cookie'

const instance = Axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    Authorization: 'Bearer ' + Cookie.get('token'),
  },
});

export default instance;
