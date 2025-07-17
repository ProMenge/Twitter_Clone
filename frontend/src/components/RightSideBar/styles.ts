import styled from 'styled-components'
import { colors } from '../../styles'
import Button from '../Button/Button'

export const RightSidebarContainer = styled.aside`
  width: 350px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
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
    /* NOVO: Permite que o user-info ocupe o máximo de espaço sem empurrar o botão de Follow */
    flex-grow: 1;
    /* NOVO: Garante que o conteúdo dentro dele não empurre o container */
    min-width: 0; /* Permite que o item encolha */
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: gray;
    background-size: cover;
    background-position: center;
    flex-shrink: 0; /* Impede que o avatar encolha */
  }

  .text-details {
    display: flex;
    flex-direction: column;
    /* NOVO: Limita a largura para que o texto possa truncar */
    flex-grow: 1;
    min-width: 0; /* Permite que este flex item encolha */
  }

  .username {
    font-weight: 700;
    font-size: 15px;
    color: ${colors.white};
    /* NOVO: Truncamento de texto */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; /* Adiciona "..." */
  }

  .handle {
    color: ${colors.lightGray};
    font-size: 14px;
    /* NOVO: Truncamento de texto */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const FollowButton = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.black};
  &:hover {
    background-color: #d7dbdd;
  }
  flex-shrink: 0; /* NOVO: Impede que o botão encolha */
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
