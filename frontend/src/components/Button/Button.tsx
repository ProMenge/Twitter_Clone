import React, { type ButtonHTMLAttributes } from 'react'
import { StyledButton } from './styles'

// Definindo a interface para as props do nosso componente Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'disabled' // Controla cores e backgrounds
  size?: 'small' | 'medium' | 'large' // Controla padding e font-size
  fullWidth?: boolean // Para ocupar 100% da largura do pai
  children: React.ReactNode // O conteúdo do botão (texto, ícones, etc.)
  // Qualquer outra prop padrão de botão HTML pode ser passada (ex: onClick, type="submit", disabled)
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary', // Padrão: primary (azul)
  size = 'medium', // Padrão: medium
  fullWidth = false, // Padrão: não ocupa 100%
  children,
  ...rest // Coleta todas as outras props (onClick, type, disabled, etc.)
}) => {
  const effectiveVariant = rest.disabled ? 'disabled' : variant

  return (
    <StyledButton
      variant={effectiveVariant}
      size={size}
      fullWidth={fullWidth}
      {...rest} // Passa todas as outras props para o StyledButton (e ele para o HTML button)
    >
      {children}
    </StyledButton>
  )
}

export default Button
