import axios from 'axios'

const api = axios.create({
  baseURL: '/api', // 所有请求自动加 /api 前缀
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：自动携带 JWT Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器（可选）：统一错误处理
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // token 失效，跳转登录（如有登录页）
      localStorage.removeItem('token')
      window.location.href = '/login' // 或使用 router
    }
    return Promise.reject(error)
  }
)

export default api