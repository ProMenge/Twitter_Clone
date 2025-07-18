import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '../../styles'
import Button from '../Button/Button'

export const StyledIconPlaceholder = styled.div`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; /* Tamanho padrão do ícone */
  color: ${colors.white};

  svg {
    width: 100%;
    height: 100%;
    color: inherit;
  }
`

export const LeftSidebarContainer = styled.aside`
  width: 275px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-right: 1px solid #2f3336;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #2f3336;
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #383b3f;
  }

  scrollbar-width: thin;
  scrollbar-color: #2f3336 transparent;

  @media (max-width: 1024px) {
    width: 72px;
    align-items: center;
    padding: 0;
    span {
      display: none; /* Esconde o texto dos itens de navegação (exceto no botão Postar) */
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`
export const SidebarLogoWrapper = styled(Link)`
  display: flex;
  align-self: flex-start;
  margin-left: 12px;
  margin-bottom: 20px;
`
export const SidebarLogo = styled.img`
  width: 30px;
  margin-bottom: 20px;
  align-self: flex-start;
`

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: fit-content;
  align-self: flex-start;
`

export const NavItem = styled.li`
  margin-bottom: 10px;

  a {
    display: flex;
    align-items: center;
    gap: 15px;
    color: ${colors.white};
    text-decoration: none;
    font-size: 18px;
    font-weight: 500;
    padding: 12px;
    border-radius: 9999px;
    transition: background-color 0.2s ease-in-out;
    width: fit-content;

    &:hover {
      background-color: #1a1a1a;
    }

    &.active {
      font-weight: 900;
    }
  }
`

export const SidebarPostButton = styled(Button).attrs({})`
  margin-top: 20px;
  padding: 15px 40px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition:
    opacity 0.2s ease-in-out,
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    /* Adicionado para transição da cor do texto */ width 0.2s ease-in-out,
    height 0.2s ease-in-out,
    padding 0.2s ease-in-out,
    font-size 0.2s ease-in-out;
  align-self: flex-start;
  width: 90%;
  max-width: 220px;
  margin-bottom: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  /* NOVO: Fundo branco, fonte preta */
  background-color: ${colors.white};
  color: ${colors.black}; /* Cor da fonte preta */

  /* Estilos para o ícone de pena e o texto dentro do botão */
  ${StyledIconPlaceholder}.post-icon {
    display: none;
  }
  span.post-text {
    display: block;
    color: ${colors.black}; /* NOVO: Garante cor do texto preta */
  }

  &:hover {
    opacity: 1; /* Removido opacity: 0.9 para hover. O X geralmente mantém opacidade 1 */
    background-color: #1d9bf0; /* NOVO: Fundo azul no hover */
    color: ${colors.white}; /* NOVO: Texto branco no hover */
  }

  /* MEDIA QUERY para telas <= 1024px */
  @media (max-width: 1024px) {
    width: 48px;
    height: 48px;
    min-width: 48px;
    padding: 0;
    font-size: 0;

    span.post-text {
      display: none;
    }
    ${StyledIconPlaceholder}.post-icon {
      display: flex;
      width: 100%;
      height: 100%;
      svg {
        width: 28px;
        height: 28px;
        color: ${colors.black}; /* NOVO: Ícone preto em background branco no mobile */
      }
    }

    &:hover {
      background-color: #1d9bf0; /* Fundo azul no hover do mobile também */
      ${StyledIconPlaceholder}.post-icon svg {
        color: ${colors.white}; /* Ícone branco no hover do mobile */
      }
    }
  }
`

export const UserInfoContainer = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  width: fit-content;
  align-self: flex-start;
  position: relative;

  &:hover {
    background-color: #1a1a1a;
    border-radius: 9999px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: gray;
    background-size: cover;
    background-position: center;
  }

  .text-info {
    display: flex;
    flex-direction: column;

    @media (max-width: 1024px) {
      display: none;
    }
  }

  .username {
    font-weight: 700;
    font-size: 15px;
  }

  .handle {
    color: ${colors.lightGray};
    font-size: 14px;
  }

  .icon {
    @media (max-width: 1024px) {
      display: none;
    }
  }
`

export const UserOptionsIcon = styled.div`
  margin-left: 20px;
  color: ${colors.lightGray};
  font-size: 18px;

  @media (max-width: 1024px) {
    display: none;
  }
`
