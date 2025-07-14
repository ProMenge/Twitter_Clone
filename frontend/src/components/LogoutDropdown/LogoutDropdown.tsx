// src/components/LeftSidebar/LogoutDropdown/index.tsx
import React, { useEffect, useRef } from 'react'
import * as S from './styles'

interface LogoutDropdownProps {
  username: string // Nome de usuário para exibir no "Sair de @username"
  onLogout: () => void // Função para lidar com o logout
  onClose: () => void // Função para fechar o dropdown (passada pelo pai)
}

const LogoutDropdown: React.FC<LogoutDropdownProps> = ({
  username,
  onLogout,
  onClose
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null) // Ref para o container do dropdown

  // Lógica para fechar o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Se o clique foi fora do dropdown (e não foi no trigger que o abriu)
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <S.DropdownContainer ref={dropdownRef}>
      <S.DropdownItem className="text-danger" onClick={onLogout}>
        Sair de {username}
      </S.DropdownItem>
    </S.DropdownContainer>
  )
}

export default LogoutDropdown
