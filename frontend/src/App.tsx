import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Rotas from './routes'
import { GlobalCss } from './styles'
function App() {
  return (
    <>
      <GlobalCss />
      <BrowserRouter>
        <AuthProvider>
          {' '}
          <Rotas />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
