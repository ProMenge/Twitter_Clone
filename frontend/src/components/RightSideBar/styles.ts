import styled from 'styled-components'
import { colors } from '../../styles'
import Button from '../Button/Button'

export const RightSidebarContainer = styled.aside`
  width: 350px; /* Largura fixa da sidebar direita */
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: sticky; /* Sidebar fixa na rolagem */
  top: 0;
  height: 100vh; /* Ocupa a altura total da viewport */
  overflow-y: auto; /* Permite rolagem */

  /* Estilo da barra de rolagem para WebKit (Chrome, Safari, Edge) */
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
  /* Estilo da barra de rolagem para Firefox */
  scrollbar-width: thin;
  scrollbar-color: #2f3336 transparent;

  @media (max-width: 1024px) {
    display: none; /* Oculta em telas menores para dar espaço */
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

  svg {
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

export const PremiumButton = styled(Button)`
  align-self: flex-start;
`

export const TrendItem = styled.div`
  padding: 8px 0;
  cursor: pointer;

  &:hover {
    background-color: #080808; /* Fundo escuro no hover */
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

export const FollowButton = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.black};
  &:hover {
    background-color: #d7dbdd;
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

export const LoadingIndicator = styled.div`
  padding: 20px;
  text-align: center;
  color: ${colors.lightGray};
  font-size: 16px;
`

export const NoSuggestionsMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${colors.lightGray};
  font-size: 16px;
`
