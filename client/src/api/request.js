import axios from "axios";

const request = axios.create({
  baseURL: "",
  timeout: 15000,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.msg ||
      error?.response?.data?.errors?.[0]?.msg ||
      error.message;
    if (status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject({ status, message, data: error?.response?.data });
  }
);

export default request;
