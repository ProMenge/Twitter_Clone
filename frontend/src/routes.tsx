import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import FeedPage from './pages/FeedPage/FeedPage'

const Rotas = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feed" element={<FeedPage />} />
    </Routes>
  )
}

export default Rotas
