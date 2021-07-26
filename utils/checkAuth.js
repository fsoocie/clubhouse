import Cookies from "nookies";
import { UserApi } from "../api/UserApi";
import Axios from "../core/axios";

export const checkAuth = async ctx => {
  try {
    const cookies = Cookies.get(ctx);
    if (cookies.token) {
      Axios.defaults.headers.Authorization = `Bearer ${cookies.token}`;
    }
    return await UserApi.getMe();
  } catch (error) {
    return null;
  }
};
