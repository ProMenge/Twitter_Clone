// src/services/api.ts
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api/'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')

    const publicUrls = ['/login/', '/register/', '/token/refresh/']

    const isPublicUrl = publicUrls.some((url) => config.url?.endsWith(url))

    if (token && !isPublicUrl) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
