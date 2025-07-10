// src/services/api.ts
import axios from 'axios'

// URL base da sua API Django
// Certifique-se que esta URL corresponde ao que você configurou no backend (e.g., http://localhost:8000)
const API_BASE_URL = 'http://localhost:8000/api/'

// Crie uma instância do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar o token JWT a todas as requisições
// Isso é crucial para acessar endpoints protegidos
api.interceptors.request.use(
  (config) => {
    // Tenta obter o token JWT do localStorage (onde será armazenado após o login)
    const token = localStorage.getItem('access_token') // O nome que usaremos para armazenar

    if (token) {
      // Se o token existe, adicione-o ao cabeçalho Authorization
      // O formato é 'Bearer SEU_TOKEN'
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // Em caso de erro na requisição (antes de ser enviada)
    return Promise.reject(error)
  }
)

export default api
