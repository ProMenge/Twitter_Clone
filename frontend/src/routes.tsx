import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'

const Rotas = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<h1>Teste Register</h1>} />
    </Routes>
  )
}

export default Rotas
