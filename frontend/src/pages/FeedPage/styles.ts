import styled from 'styled-components'
import { colors } from '../../styles'

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
  padding: 40px;
  text-align: center;
  color: ${colors.lightGray};
  font-size: 20px;
  font-weight: 700;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`
