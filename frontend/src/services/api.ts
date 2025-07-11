// src/services/api.ts
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api/'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar o token JWT a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')

    // ### CORREÇÃO APLICADA AQUI ###
    // Define as rotas públicas que NUNCA devem receber o token.
    // Usamos o final da URL para sermos mais flexíveis.
    const publicUrls = ['/login/', '/register/', '/token/refresh/']

    const isPublicUrl = publicUrls.some((url) => config.url?.endsWith(url))

    // Só anexa o token se ele existir E a rota NÃO for pública.
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
