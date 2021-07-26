import Axios from "../core/axios";

export const UserApi = {
  getMe: async () => {
    const { data } = await Axios.get("/auth/me");
    return data;
  },
};
