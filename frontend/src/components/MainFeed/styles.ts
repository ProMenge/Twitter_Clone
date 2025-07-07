import styled from 'styled-components'
import { colors } from '../../styles'

export const MainContentContainer = styled.main`
  flex-grow: 1; /* Ocupa o máximo de espaço disponível */
  max-width: 600px; /* Largura máxima da coluna central */
  border-left: 1px solid #2f3336;
  border-right: 1px solid #2f3336;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%; /* Ocupa a largura total em mobile */
    border-left: none; /* Remove bordas em mobile */
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
      width: 50px; /* Largura da barra azul ativa */
      height: 4px;
      background-color: #1d9bf0;
      border-radius: 2px;
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
  line-height: 24px; /* Altura da linha para espaçamento vertical */
  padding-top: 12px; /* Ajusta o padding para alinhar com o input do X */
`
