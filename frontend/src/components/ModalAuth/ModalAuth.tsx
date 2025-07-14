import { useEffect, useState } from 'react'
import logo from '../../assets/images/logo-white.png'
import LoginPanel from './LoginPanel/LoginPanel'
import RegisterPanel from './RegisterPanel/RegisterPanel'
import * as S from './styles'

interface ModalAuthProps {
  isOpen: boolean
  onClose: () => void
  title: string
  type: 'login' | 'register'
}

export default function ModalAuth({
  isOpen,
  onClose,
  title,
  type
}: ModalAuthProps) {
  const [generalError, setGeneralError] = useState<string | null>(null)
  useEffect(() => {}, [type])
  if (!isOpen) return null

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose}>×</S.CloseButton>
        <S.Logo src={logo} alt="Logo X" />
        <S.Title>{title}</S.Title>
        {generalError && <S.Error>{generalError}</S.Error>}
        {type === 'register' ? (
          <RegisterPanel setGeneralError={setGeneralError} onClose={onClose} />
        ) : (
          <LoginPanel onClose={onClose} setGeneralError={setGeneralError} />
        )}
      </S.Modal>
    </S.Overlay>
  )
}
