import React, { type ButtonHTMLAttributes } from 'react'
import { StyledButton } from './styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'disabled'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  ...rest
}) => {
  const effectiveVariant = rest.disabled ? 'disabled' : variant

  return (
    <StyledButton
      variant={effectiveVariant}
      size={size}
      fullWidth={fullWidth}
      {...rest}
    >
      {children}
    </StyledButton>
  )
}

export default Button
