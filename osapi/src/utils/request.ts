import axios from "axios";

const _APP_BASE_API = import.meta.env.VITE_APP_BASE_API

const http = axios.create({
  baseURL: '/api',
  timeout: 100000 // request timeout
})

// 发起请求之前的拦截器
// http.interceptors.request.use(
//   config => {
//     // 如果有token 就携带tokon
//     const token = window.localStorage.getItem("token");
//     if (token) {
//       config.headers.common.Authorization = token;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// 响应拦截器
// http.interceptors.response.use(
//   response => {
//     const res = response.data;
//     if (response.status !== 200) {
//       return Promise.reject(new Error(res.message || "Error"));
//     } else {
//       return res;
//     }
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

export default http
