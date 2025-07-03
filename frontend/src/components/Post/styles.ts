import styled from 'styled-components'
import { colors } from '../../styles'
export const PostContainer = styled.div`
  display: flex;
  padding: 12px 16px; /* Padding interno como no X */
  border-bottom: 1px solid #2f3336; /* Divisor de posts */
  cursor: pointer; /* Indica que o post é clicável */
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #080808; /* Fundo mais escuro no hover */
  }
`

export const AvatarWrapper = styled.div`
  flex-shrink: 0; /* Não permite que o avatar encolha */
  width: 48px; /* Tamanho do avatar */
  height: 48px;
  border-radius: 50%; /* Avatar circular */
  background-color: gray; /* Cor de fallback/placeholder */
  margin-right: 12px; /* Espaçamento à direita do avatar */
  background-size: cover; /* Para garantir que a imagem preencha */
  background-position: center; /* Para centralizar a imagem */
`

export const PostContentWrapper = styled.div`
  flex-grow: 1; /* Ocupa o restante do espaço */
  display: flex;
  flex-direction: column;
`

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px; /* Espaço abaixo do cabeçalho */
`

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* Permite quebrar se o nome for muito longo */
`

export const Username = styled.span`
  font-weight: 700; /* Negrito para o nome do usuário */
  font-size: 15px;
  color: ${colors.white};
  margin-right: 4px;

  &:hover {
    text-decoration: underline; /* Sublinha no hover */
  }
`

export const Handle = styled.span`
  color: ${colors.lightGray};
  font-size: 15px;
  margin-right: 4px;
`

export const Timestamp = styled.span`
  color: ${colors.lightGray};
  font-size: 15px;
  white-space: nowrap; /* Impede que o timestamp quebre linha */

  &::before {
    content: '•'; /* Ponto separador como no X */
    margin: 0 4px;
  }
`

export const PostText = styled.p`
  font-size: 15px;
  color: ${colors.white};
  line-height: 20px; /* Espaçamento entre linhas */
  margin-bottom: 12px; /* Espaço antes da imagem ou ações */
  word-wrap: break-word; /* Garante que palavras longas quebrem */
`

export const PostImage = styled.img`
  max-width: 100%;
  border-radius: 16px; /* Bordas arredondadas para a imagem */
  margin-top: 12px; /* Espaço acima da imagem */
  margin-bottom: 12px; /* Espaço abaixo da imagem */
  height: auto; /* Garante que a altura seja ajustada proporcionalmente */
  display: block; /* Remove espaço extra abaixo da imagem */
`

export const PostActions = styled.div`
  display: flex;
  justify-content: space-between; /* Distribui os ícones igualmente */
  margin-top: 10px; /* Espaço acima das ações */
  color: ${colors.lightGray};
  width: 100%;
  max-width: 425px; /* Limitador de largura para as ações, como no X */

  @media (max-width: 768px) {
    max-width: none; /* Em mobile, ocupa a largura total */
  }
`

export const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px; /* Espaço entre o ícone e o número */
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  /* Estilo base para os ícones */
  svg {
    font-size: 18px; /* Tamanho dos ícones de ação */
    transition: color 0.2s ease-in-out;
  }

  /* Hover states for specific icons */
  &.reply:hover {
    color: #1d9bf0; /* Azul do X */
    svg {
      color: #1d9bf0;
    }
  }
  &.retweet:hover {
    color: #00ba7c; /* Verde do X */
    svg {
      color: #00ba7c;
    }
  }
  &.like:hover {
    color: #f91880; /* Rosa do X */
    svg {
      color: #f91880;
    }
  }
  &.views:hover {
    color: #1d9bf0; /* Azul do X */
    svg {
      color: #1d9bf0;
    }
  }
  &.share:hover {
    color: #1d9bf0; /* Azul do X */
    svg {
      color: #1d9bf0;
    }
  }
`

export const OptionsButton = styled.button`
  background: none;
  border: none;
  color: ${colors.lightGray};
  font-size: 18px; /* Tamanho do ícone de reticências */
  cursor: pointer;
  padding: 5px; /* Área clicável maior */
  border-radius: 50%;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
  margin-left: auto; /* Empurra para a direita */

  &:hover {
    background-color: #1a1a1a;
    color: ${colors.white};
  }
`
