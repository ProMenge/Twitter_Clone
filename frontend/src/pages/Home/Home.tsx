import * as S from './styles'
import logo from '../../assets/images/logo.svg'
import { useState } from 'react'
import Footer from '../../components/Footer/Footer'
import ModalAuth from '../../components/ModalAuth/ModalAuth'

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

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
            <S.CreateButton onClick={() => setShowRegister(true)}>
              Criar conta
            </S.CreateButton>

            <S.Terms>
              Ao se inscrever, você concorda com os{' '}
              <a href="#">Termos de Serviço</a> e a{' '}
              <a href="#">Política de Privacidade</a>, incluindo o{' '}
              <a href="#">Uso de Cookies</a>.
            </S.Terms>

            <S.LoginText>Já tem uma conta?</S.LoginText>

            <S.LoginButton onClick={() => setShowLogin(true)}>
              Entrar
            </S.LoginButton>
          </S.ButtonContainer>
        </S.Right>
      </S.Container>

      <ModalAuth
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        title="Criar sua conta"
        type="register"
      />

      <ModalAuth
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        title="Entrar no X"
        type="login"
      />

      <Footer />
    </>
  )
}
