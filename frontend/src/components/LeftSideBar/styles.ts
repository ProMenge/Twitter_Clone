import styled from 'styled-components'
import { colors } from '../../styles'
import Button from '../Button/Button'
// Copiado de FeedPage/styles.ts
export const StyledIconPlaceholder = styled.div`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${colors.white};

  svg {
    width: 100%;
    height: 100%;
    color: inherit;
  }
`

// Copiado de FeedPage/styles.ts
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

  /* --- Estilo da barra de rolagem para WebKit (Chrome, Safari, Edge) --- */
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
  /* --- Estilo da barra de rolagem para Firefox --- */
  scrollbar-width: thin;
  scrollbar-color: #2f3336 transparent;

  /* Oculta a sidebar em telas menores */
  @media (max-width: 1024px) {
    width: 80px;
    align-items: center;
    span {
      display: none;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`

// Copiado de FeedPage/styles.ts
export const SidebarLogo = styled.img`
  width: 30px;
  margin-bottom: 20px;
  align-self: flex-start;
`

// Copiado de FeedPage/styles.ts
export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: fit-content;
  align-self: flex-start;
  margin-top: 10px;
`

// Copiado de FeedPage/styles.ts
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

// Copiado de FeedPage/styles.ts e renomeado para evitar conflito com Button global
export const SidebarPostButton = styled(Button)`
  margin-top: 20px;
  background-color: ${colors.white};
  color: black;
  border: none;
  border-radius: 9999px;
  padding: 15px 40px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
  transition: opacity 0.2s ease-in-out;
  align-self: flex-start;
  width: 100%;
  margin-bottom: 16px;

  &:hover {
    opacity: 0.9;
    background-color: #1d9bf0;
  }
`

// Copiado de FeedPage/styles.ts
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
  position: relative; /* ADICIONADO: Essencial para posicionar o LogoutDropdown */

  &:hover {
    background-color: #1a1a1a;
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
`
