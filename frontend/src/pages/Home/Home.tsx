import * as S from './styles'
import logo from '../../assets/images/logo.svg'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <S.Container>
        <S.Left>
          <S.Logo src={logo} alt="Logo X" />
        </S.Left>
        <S.Right>
          <S.Title>Acontecendo agora</S.Title>
          <S.Subtitle>Inscreva-se hoje</S.Subtitle>

          <S.ButtonContainer>
            <S.CreateButton onClick={() => navigate('/register')}>
              Criar conta
            </S.CreateButton>

            <S.Terms>
              Ao se inscrever, você concorda com os{' '}
              <a href="#">Termos de Serviço</a> e a{' '}
              <a href="#">Política de Privacidade</a>, incluindo o{' '}
              <a href="#">Uso de Cookies</a>.
            </S.Terms>

            <S.LoginText>Já tem uma conta?</S.LoginText>

            <S.LoginButton onClick={() => navigate('/login')}>
              Entrar
            </S.LoginButton>
          </S.ButtonContainer>
        </S.Right>
      </S.Container>
      <Footer />
    </>
  )
}
