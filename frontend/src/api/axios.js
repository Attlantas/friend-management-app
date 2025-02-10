import axios from "axios";
import {API_BASE_URL} from "../constants";

// Create Axios instance
const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor: Attach token to headers
instance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle unauthorized errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear any stored tokens
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // Redirect to login page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default instance;
