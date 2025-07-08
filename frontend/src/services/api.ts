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

// Interceptor para lidar com erros de resposta (opcional, mas útil para refresh de token)
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     // Se o erro for 401 Unauthorized e não for a requisição de refresh token em si,
//     // e o token estiver expirado, tente renová-lo.
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Marca a requisição para não entrar em loop infinito
//       try {
//         const refreshToken = localStorage.getItem('refresh_token');
//         if (refreshToken) {
//           const response = await axios.post(`${API_BASE_URL}token/refresh/`, {
//             refresh: refreshToken,
//           });
//           localStorage.setItem('access_token', response.data.access);
//           localStorage.setItem('refresh_token', response.data.refresh);
//           // Tenta a requisição original novamente com o novo token
//           originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         // Se o refresh token falhar, o usuário precisa fazer login novamente
//         console.error('Refresh token expirado ou inválido, redirecionando para login:', refreshError);
//         // Redirecione para a página de login aqui (ex: window.location.href = '/login')
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api
