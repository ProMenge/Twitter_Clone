import { useState } from 'react'
import logo from '../../assets/images/logo.svg'
import Button from '../../components/Button/Button'
import Footer from '../../components/Footer/Footer'
import ModalAuth from '../../components/ModalAuth/ModalAuth'
import * as S from './styles'

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const isModalOpen = showLogin || showRegister

  return (
    <>
      <S.ContentWrapper className={isModalOpen ? 'blurred' : ''}>
        <S.Container>
          <S.Left>
            <S.Logo src={logo} alt="Logo X" />
          </S.Left>
          <S.Right>
            <S.Title>Acontecendo agora</S.Title>
            <S.Subtitle>Inscreva-se hoje</S.Subtitle>

            <S.ButtonContainer>
              <Button
                variant="primary"
                size="medium"
                fullWidth
                onClick={() => setShowRegister(true)}
              >
                Criar conta
              </Button>

              <S.Terms>
                Ao se inscrever, você concorda com os{' '}
                <a href="#">Termos de Serviço</a> e a{' '}
                <a href="#">Política de Privacidade</a>, incluindo o{' '}
                <a href="#">Uso de Cookies</a>.
              </S.Terms>

              <S.LoginText>Já tem uma conta?</S.LoginText>
              <Button
                variant="secondary"
                size="medium"
                fullWidth
                onClick={() => setShowLogin(true)}
              >
                Entrar
              </Button>
            </S.ButtonContainer>
          </S.Right>
        </S.Container>
        <Footer />
      </S.ContentWrapper>

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
    </>
  )
}
