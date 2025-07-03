import styled from 'styled-components'
import { colors } from '../../styles'
import Button from '../../components/Button/Button'
// Novo Styled Component para o placeholder do ícone
export const StyledIconPlaceholder = styled.div`
  width: 20px;
  height: 22px;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; /* Aumenta o tamanho do ícone em si */
  color: ${colors.white}; /* Garante a cor do ícone */

  svg {
    width: 100%;
    height: 100%;

    color: inherit;
  }
`

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.black};
  color: ${colors.white};
  font-family: 'Chirp', sans-serif;
  width: 100%;
  justify-content: center;
`

export const LeftSidebar = styled.aside`
  width: 275px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-right: 1px solid #2f3336;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto; /* Permite rolagem se o conteúdo da sidebar for maior que a tela */

  /* --- Estilo da barra de rolagem para WebKit (Chrome, Safari, Edge) --- */
  &::-webkit-scrollbar {
    width: 8px; /* Largura da barra de rolagem vertical */
    background: transparent; /* Fundo da barra de rolagem (trilha) transparente */
  }

  &::-webkit-scrollbar-thumb {
    background: #2f3336; /* Cor do "polegar" (parte que você arrasta) - cinza escuro */
    border-radius: 4px; /* Bordas arredondadas */
    /* Isso cria um "padding" visual dentro do thumb, tornando-o mais fino */
    border: 2px solid transparent; /* Borda transparente ao redor do polegar */
    background-clip: padding-box; /* Garante que a borda transparente não seja preenchida */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #383b3f; /* Cor do polegar ao passar o mouse, um pouco mais claro */
  }

  /* --- Estilo da barra de rolagem para Firefox --- */
  scrollbar-width: thin; /* 'auto' | 'none' | 'thin' */
  scrollbar-color: #2f3336 transparent; /* 'thumb color' 'track color' */

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
  margin-top: 10px;
`

export const NavItem = styled.li`
  margin-bottom: 6px;

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

export const PostButton = styled.button`
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

  @media (max-width: 1024px) {
    width: 50px; /* Largura reduzida, mas agora sem ícone */
    height: 50px;
    padding: 0; /* Remove padding para ficar redondo */
    font-size: 0;
  }
  padding-left: 12px;
  padding-right: 12px;
  min-width: 180px; /* Largura mínima para o botão de postar */

  @media (max-width: 1024px) {
    width: 48px;
    height: 48px;
    min-width: 48px;
    padding: 0;
    font-size: 0;
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

  &:hover {
    background-color: #1a1a1a;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: gray;
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

export const MainContent = styled.main`
  flex-grow: 1;
  max-width: 600px;
  border-left: 1px solid #2f3336;
  border-right: 1px solid #2f3336;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-right: none;
  }
`

export const FeedHeader = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #2f3336;
  position: sticky;
  top: 0;
  background-color: ${colors.black};
  z-index: 10;
`

export const FeedHeaderTab = styled.div`
  flex: 1;
  padding: 15px 0;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  color: ${colors.lightGray};
  transition: background-color 0.2s ease-in-out;
  position: relative;

  &:hover {
    background-color: #080808;
  }

  &.active {
    color: ${colors.white};
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 4px;
      background-color: #1d9bf0;
      border-radius: 2px;
    }
  }
`

export const RightSidebar = styled.aside`
  width: 350px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto; /* Permite rolagem */

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

  @media (max-width: 1024px) {
    display: none;
  }
`

export const SearchBar = styled.div`
  background-color: #202327;
  border-radius: 9999px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  .search-icon {
    color: ${colors.lightGray};
    font-size: 20px;
  }

  input {
    background: transparent;
    border: none;
    color: ${colors.white};
    font-size: 15px;
    outline: none;
    width: 100%;

    &::placeholder {
      color: ${colors.lightGray};
    }
  }
`

export const SectionBox = styled.div`
  background-color: #16181c;
  border-radius: 16px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`

export const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
`

export const TrendItem = styled.div`
  padding: 8px 0;
  cursor: pointer;

  &:hover {
    background-color: #080808;
  }

  .category {
    font-size: 13px;
    color: ${colors.lightGray};
  }

  .hashtag {
    font-size: 15px;
    font-weight: 700;
    color: ${colors.white};
  }

  .tweets-count {
    font-size: 13px;
    color: ${colors.lightGray};
  }
`

export const WhoToFollowItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  cursor: pointer;

  &:hover {
    background-color: #080808;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: gray;
  }

  .text-details {
    display: flex;
    flex-direction: column;
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

export const SidebarFooter = styled.div`
  margin-top: 20px;
  font-size: 13px;
  color: ${colors.lightGray};
  padding-bottom: 20px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;

  a {
    color: ${colors.lightGray};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

export const PostCreationSection = styled.div`
  display: flex;
  align-items: flex-start; /* Alinha o avatar e o texto no topo */
  padding: 12px 16px;
  border-bottom: 1px solid #2f3336;
  cursor: pointer; /* Indica que a seção é clicável */
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #080808; /* Fundo mais escuro no hover */
  }
`

export const PostCreationSectionAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0; /* Impede que o avatar encolha */
`

export const PostCreationSectionText = styled.span`
  flex-grow: 1; /* Permite que o texto ocupe o restante do espaço */
  color: ${colors.lightGray};
  font-size: 20px; /* Tamanho da fonte como no X */
  line-height: 24px;
  padding-top: 12px;
`
export const SidebarPostButton = styled(Button)`
  margin-top: 20px;
  align-self: flex-start;
  background-color: ${colors.white};
  color: ${colors.black};
  padding-left: 12px;
  padding-right: 12px;
  min-width: 180px; /* Largura mínima para o botão de postar */
  width: 100%;

  @media (max-width: 1024px) {
    width: 48px; /* Tamanho do círculo */
    height: 48px;
    min-width: 48px; /* Garante que não encolha demais */
    padding: 0; /* Remove padding para ficar redondo */
    font-size: 0; /* Esconde o texto */
  }
`

export const PremiumButton = styled(Button)`
  align-self: flex-start;
`

export const FollowButton = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.black};
  &:hover {
    background-color: #d7dbdd;
  }
`
