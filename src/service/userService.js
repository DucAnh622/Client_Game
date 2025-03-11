import axios from "../config/axios";

const loginUser = (data) => {
  return axios.post("/login", {
    username: data.email,
    password: data.password,
  });
};

const registerUser = (data) => {
  return axios.post("/register", { ...data });
};

const getInfomation = (id) => {
  return axios.get(`/user/${id}`);
};

const updateUser = (data) => {
  return axios.put(`/user/update/${data.id}`, { ...data });
};

const refreshToken = () => {
  return axios.get('/auth/refresh')
}

const logoutUser = () => {
  return axios.get("/logout");
};

export { loginUser, registerUser, getInfomation, updateUser, logoutUser, refreshToken };
