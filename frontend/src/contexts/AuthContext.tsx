// src/contexts/AuthContext.tsx
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api' // Importar a instância do Axios configurada

import type { AuthSuccessResponse } from '../types'

interface CurrentUser {
  id: number
  username: string
  email: string
  display_name: string
  avatar_url: string
  bio: string
  location: string
  website: string
  birth_date: string
  created_at: string
  followers_count: number
  following_count: number
}

interface AuthContextType {
  user: CurrentUser | null // Dados do usuário logado
  isAuthenticated: boolean // True se houver um usuário logado
  isLoadingAuth: boolean // True durante a verificação inicial de autenticação
  login: (
    accessToken: string,
    refreshToken: string,
    userData: CurrentUser
  ) => void // Função para login
  logout: () => void // Função para logout
  // Opcional: função para refresh do token se quiser gerenciá-la aqui
}

// Criar o Contexto de Autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Criar o Provedor de Autenticação
interface AuthProviderProps {
  children: ReactNode // Componentes filhos que terão acesso ao contexto
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true) // Começa true para verificar localStorage
  const navigate = useNavigate()

  // Função para efetuar o login (chamada pelo ModalAuth)
  const login = useCallback(
    (accessToken: string, refreshToken: string, userData: CurrentUser) => {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      localStorage.setItem('user_data', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
      // Não navega aqui, quem chama o login decidirá a navegação
    },
    []
  )

  // Função para efetuar o logout (chamada por componentes como LeftSidebar)
  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    setUser(null)
    setIsAuthenticated(false)
    console.log('Usuário deslogado do AuthContext.')

    navigate('/')
  }, [navigate])

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem('access_token')

      const storedUserData = localStorage.getItem('user_data')

      if (storedAccessToken && storedUserData) {
        try {
          const userDataParsed: CurrentUser = JSON.parse(storedUserData)

          setUser(userDataParsed)
          setIsAuthenticated(true)
        } catch (e) {
          console.error('Erro ao parsear dados do usuário do localStorage:', e)
          logout() // Desloga se os dados estiverem corrompidos
        }
      }
      setIsLoadingAuth(false) // Finaliza o carregamento inicial
    }

    initializeAuth()
  }, [logout])

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true

          const refreshToken = localStorage.getItem('refresh_token')
          if (refreshToken) {
            try {
              const response = await api.post<AuthSuccessResponse>(
                'token/refresh/',
                { refresh: refreshToken }
              )

              localStorage.setItem('access_token', response.data.access_token!)
              localStorage.setItem(
                'refresh_token',
                response.data.refresh_token || ''
              )

              originalRequest.headers['Authorization'] =
                `Bearer ${response.data.access_token}`
              return api(originalRequest)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (refreshError: any) {
              console.error(
                'Falha ao renovar token. Redirecionando para login:',
                refreshError
              )
              logout() // Força o logout
              return Promise.reject(refreshError) // Rejeita o erro
            }
          } else {
            console.warn(
              'Refresh token não encontrado. Redirecionando para login.'
            )
            logout()
            return Promise.reject(error)
          }
        }
        return Promise.reject(error)
      }
    )

    // Função de limpeza para remover o interceptor quando o componente é desmontado
    return () => {
      api.interceptors.response.eject(interceptor)
    }
  }, [logout]) // Depende da função logout

  const contextValue = {
    user,
    isAuthenticated,
    isLoadingAuth,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

// Hook customizado para consumir o Contexto de Autenticação
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
