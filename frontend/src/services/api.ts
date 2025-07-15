// src/services/api.ts
import axios from 'axios'

// NOVO: Usar variável de ambiente para a URL base da API
// Para Vite, variáveis de ambiente são acessadas via import.meta.env.VITE_NOME_DA_VARIAVEL
// Crie um .env na raiz do projeto frontend para desenvolvimento
// Exemplo: .env.development -> VITE_API_BASE_URL=http://localhost:8000/api/
//          .env.production -> VITE_API_BASE_URL=https://sua-api-publica.onrender.com/api/
// Ou use um valor padrão para desenvolvimento e sobrescreva no ambiente de deploy
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/'

// Crie uma instância do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar o token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
