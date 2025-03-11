import axios from "axios";
import { refreshToken } from "../service/userService";
import { useDispatch, useSelector } from "react-redux";
import { refreshSuccess } from "../redux/action/userAction";
import { store } from "../redux/store";

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(
  function (config) {
    const jwtToken = store?.getState()?.user?.account?.jwt;
    if (jwtToken !== null || jwtToken !== "") {
      config.headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },

  async function (error) {
    const originalRequest = error.config;
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await refreshToken();
        if (response && response.status === 200) {
          const newToken = response.data.access_token;
          store.dispatch(refreshSuccess(newToken));
          originalRequest.headers["Authorization"] = "Bearer " + newToken;
        }
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        return Promise.reject(refreshError);
      }
    }
    if (error.response) {
      return error.response.data;
    }
    return Promise.reject(error);
  }
);

export default instance;
