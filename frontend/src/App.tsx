import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Rotas from './routes'
import { GlobalCss } from './styles'
function App() {
  return (
    <>
      <GlobalCss />
      {/* CORREÇÃO AQUI: BrowserRouter agora envolve AuthProvider */}
      <BrowserRouter>
        <AuthProvider>
          {' '}
          {/* AuthProvider agora está dentro do BrowserRouter */}
          <Rotas />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
