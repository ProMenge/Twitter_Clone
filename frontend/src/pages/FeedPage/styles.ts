import styled from 'styled-components'
import { colors } from '../../styles'
// Novo Styled Component para o placeholder do ícone

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.black};
  color: ${colors.white};
  font-family: 'Chirp', sans-serif;
  width: 100%;
  justify-content: center;
`

export const LoadingIndicator = styled.div`
  padding: 40px; /* Mais padding para um indicador global */
  text-align: center;
  color: ${colors.lightGray};
  font-size: 20px; /* Tamanho maior para um indicador global */
  font-weight: 700;
  width: 100%; /* Ocupa a largura total para centralizar */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ocupa a altura total da tela */
`
