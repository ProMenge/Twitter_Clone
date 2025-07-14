import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import FeedPage from './pages/FeedPage/FeedPage'
import ProtectedRoute from './routes/PrivateRoute'

const Rotas = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default Rotas
