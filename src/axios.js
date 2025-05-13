import axios from "axios";
import router from '@/router'

axios.defaults.baseURL = "https://sys.sawa.sawa.academy/";

axios.defaults.headers.common['Access-Control-Allowffff-Origin'] = '*'

axios.interceptors.request.use((config) => {
  config.headers.lang = localStorage.getItem("appLang");

  try {
    config.headers.Authorization = `Bearer ${JSON.parse(
      localStorage.getItem("token")
    )}`;
  } catch (error) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  config.headers.Accept = "application/json";
  // config.headers["Content-Type"] = "application/json";
  return config;
});
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)

export default axios