import axios from "axios";

const _APP_BASE_API = import.meta.env.VITE_APP_BASE_API

const http = axios.create({
  // baseURL: '/api',
  baseURL: _APP_BASE_API,
  timeout: 100000, // request timeout
  headers: {
    // 设置token
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  }
})

export default http
