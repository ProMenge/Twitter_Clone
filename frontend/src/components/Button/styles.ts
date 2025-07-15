import styled, { css } from 'styled-components'
import { colors } from '../../styles'

interface StyledButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'disabled'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
}

export const StyledButton = styled.button<StyledButtonProps>`
  border: none;
  border-radius: 9999px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    opacity 0.2s ease-in-out,
    color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 8px 15px;
          font-size: 14px;
        `
      case 'large':
        return css`
          padding: 15px 40px;
          font-size: 17px;
        `
      case 'medium':
      default:
        return css`
          padding: 12px 20px;
          font-size: 16px;
        `
    }
  }}

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${colors.lightBlue};
          color: ${colors.white};

          &:hover {
            opacity: 0.9;
            background-color: #1a92da;
          }
        `
      case 'secondary':
        return css`
          background-color: transparent;
          color: ${colors.lightBlue};
          border: 1px solid #536471;

          &:hover {
            background-color: rgba(29, 155, 240, 0.1);
            border-color: #1d9bf0;
          }
        `
      case 'ghost':
        return css`
          background-color: transparent;
          color: #1d9bf0;
          border: none;

          &:hover {
            background-color: rgba(29, 155, 240, 0.1);
          }
        `
      case 'disabled':
        return css`
          background-color: #ebeef0;
          color: #000;
          cursor: not-allowed;
          opacity: 0.8;
        `
      default:
        return css`
          background-color: ${colors.lightBlue};
          color: ${colors.white};

          &:hover {
            opacity: 0.9;
            background-color: #1a92da;
          }
        `
    }
  }}

  &:disabled {
    background-color: #164d7a;
    color: ${colors.white};
    cursor: not-allowed;
    opacity: 0.5;
  }
`
