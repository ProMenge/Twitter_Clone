import styled from 'styled-components'

// Definindo algumas cores para reutilização
const footerTextColor = '#71767B' // Cor dos links e do texto de copyright
const footerLinkHoverColor = '#fff' // Cor do link ao passar o mouse
const footerLinkActiveColor = '#d9d9d9' // Cor do link ao clicar (opcional)

export const Container = styled.footer`
  background-color: #000; // Fundo preto
  padding: 10px 0;
  text-align: center;
  font-size: 13px; // Tamanho de fonte base para o footer
  color: ${footerTextColor}; // Cor padrão do texto
`

export const Nav = styled.nav`
  display: flex;
  flex-direction: column; // Empilha as duas linhas de links
  align-items: center; // Centraliza horizontalmente
  gap: 5px; // Espaçamento entre as duas linhas de links
`

export const NavList = styled.ul`
  display: flex;
  flex-wrap: wrap; // Permite que os links quebrem para a próxima linha em telas menores
  justify-content: center; // Centraliza os links horizontalmente
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 5px; // Espaçamento entre os itens da lista
`

export const NavItem = styled.li`
  display: flex;
  align-items: center; // Alinha o texto e o pipe

  a {
    color: ${footerTextColor};
    text-decoration: none;
    padding: 0 5px; // Espaçamento ao redor do texto do link

    &:hover {
      text-decoration: underline; // Sublinha ao passar o mouse
      color: ${footerLinkHoverColor};
    }

    &:active {
      color: ${footerLinkActiveColor}; // Cor ao clicar
    }
  }

  span {
    // Estilo para o pipe (|)
    color: ${footerTextColor};
    margin: 0 5px; // Espaçamento ao redor do pipe
  }

  // Oculta o pipe no último item de cada lista
  &:last-child {
    span {
      display: none;
    }
  }
`

export const CopyrightText = styled.p`
  margin-left: 10px; // Espaço entre o último link e o copyright na mesma linha
  white-space: nowrap; // Evita quebra de linha no copyright
  color: ${footerTextColor};
`
