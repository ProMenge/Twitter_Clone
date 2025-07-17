import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import FeedPage from './pages/FeedPage/FeedPage'
import ProtectedRoute from './routes/PrivateRoute' // Assuming PrivateRoute is correctly implemented
import ProfilePage from './pages/ProfilePage/ProfilePage'

// NOVO: Componente para redirecionar se o usuário já estiver autenticado
// Isso evita que um usuário logado veja a tela inicial/login novamente
import { useAuth } from './contexts/AuthContext' // Importar useAuth
import React, { useEffect } from 'react' // Adicionar React import
import FollowsListPage from './pages/FollowsListPage/FollowsListPage'
import PostDetailPage from './pages/PostDetailPage/PostDetailPage'

const RedirectIfAuthenticated: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { isAuthenticated, isLoadingAuth } = useAuth()
  const navigate = useNavigate() // useNavigate precisa estar dentro de um Router

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      navigate('/feed', { replace: true }) // Redireciona para o feed se já logado
    }
  }, [isAuthenticated, isLoadingAuth, navigate])

  if (isLoadingAuth || isAuthenticated) {
    // Se está carregando ou já autenticado, não renderiza o Home
    return null // ou um spinner temporário
  }

  return <>{children}</>
}

const Rotas = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          // NOVO: Redireciona de / para /feed se o usuário já estiver logado
          <RedirectIfAuthenticated>
            <Home />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      {/* CORREÇÃO AQUI: Rota para a página de perfil com :username e protegida */}
      <Route
        path="/profile/:username"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:username/followers"
        element={
          <ProtectedRoute>
            <FollowsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:username/following"
        element={
          <ProtectedRoute>
            <FollowsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/:postId"
        element={
          <ProtectedRoute>
            <PostDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default Rotas
