// src/components/LeftSidebar/LogoutDropdown/index.tsx
import React, { useEffect, useRef } from 'react'
import * as S from './styles'

interface LogoutDropdownProps {
  username: string
  onLogout: () => void
  onClose: () => void
}

const LogoutDropdown: React.FC<LogoutDropdownProps> = ({
  username,
  onLogout,
  onClose
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
