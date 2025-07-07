import styled, { css } from 'styled-components'
import { colors } from '../../styles'

// Interfaces para as props que o StyledButton irá receber
interface StyledButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'disabled' // primary: azul, secondary: transparente com borda, ghost: sem fundo, disabled: cinza (quando não é disabled nativo do HTML)
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean // Para ocupar 100% da largura
}

export const StyledButton = styled.button<StyledButtonProps>`
  border: none;
  border-radius: 9999px; /* Botão em formato de pílula */
  font-size: 16px;
  font-weight: 700; /* Peso da fonte padrão */
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    opacity 0.2s ease-in-out,
    color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
  display: inline-flex; /* Para alinhar o conteúdo, se houver ícones futuramente */
  align-items: center;
  justify-content: center;
  white-space: nowrap; /* Impede que o texto quebre linha */

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  /* --- Tamanhos --- */
  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 8px 15px; /* Para botões menores como "Seguir" */
          font-size: 14px;
        `
      case 'large':
        return css`
          padding: 15px 40px; /* Para o botão "Postar" na sidebar e botões grandes do modal */
          font-size: 17px;
        `
      case 'medium': // Padrão
      default:
        return css`
          padding: 12px 20px; /* Para botões como "Criar conta", "Entrar" */
          font-size: 16px;
        `
    }
  }}

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${colors.lightBlue}; /* Azul do X */
          color: ${colors.white};

          &:hover {
            opacity: 0.9;
            background-color: #1a92da; /* Levemente mais escuro no hover */
          }
        `
      case 'secondary':
        return css`
          background-color: transparent;
          color: ${colors.lightBlue}; /* Texto azul */
          border: 1px solid #536471; /* Borda cinza */

          &:hover {
            background-color: rgba(
              29,
              155,
              240,
              0.1
            ); /* Fundo azul claro no hover */
            border-color: #1d9bf0; /* Borda azul no hover */
          }
        `
      case 'ghost':
        return css`
          background-color: transparent;
          color: #1d9bf0; /* Texto azul */
          border: none;

          &:hover {
            background-color: rgba(29, 155, 240, 0.1);
          }
        `
      case 'disabled': // Este variant é para quando o botão tem um estilo de "desabilitado" mesmo antes de usar a prop `disabled` do HTML
        return css`
          background-color: #ebeef0; /* Cinza claro */
          color: #000; /* Texto preto */
          cursor: not-allowed;
          opacity: 0.8; /* Levemente transparente */
        `
      default: // Padrão será Primary se não especificado
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
    background-color: #164d7a; /* Azul escuro quase preto quando nativamente desabilitado */
    color: ${colors.white}; /* Texto branco */
    cursor: not-allowed;
    opacity: 0.5; /* Mais opaco */
  }
`
