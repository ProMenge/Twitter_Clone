import { GlobalCss } from './styles'
import { BrowserRouter } from 'react-router-dom'
import Rotas from './routes'
function App() {
  return (
    <>
      <GlobalCss />
      <BrowserRouter>
        <Rotas />
      </BrowserRouter>
    </>
  )
}

export default App
