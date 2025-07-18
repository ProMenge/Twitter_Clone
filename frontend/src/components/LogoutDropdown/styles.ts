import styled from 'styled-components'
import { colors } from '../../styles'

export const DropdownContainer = styled.div`
  position: absolute; // ✅ deixa relativo ao UserInfoContainer
  bottom: 100%; // ✅ sobe acima do UserInfoContainer
  left: 0; // ou use right: 0 para alinhar à direita
  background-color: ${colors.black};
  border-radius: 16px;
  box-shadow:
    rgba(255, 255, 255, 0.2) 0px 0px 15px,
    rgba(255, 255, 255, 0.15) 0px 0px 3px 1px;
  width: 220px;
  overflow: hidden;
  z-index: 1000;
  padding: 10px 0;
  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    bottom: -9px;
    left: 12px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${colors.black};
    z-index: 1001;
  }

  @media (max-width: 1024px) {
    position: fixed;
    position: fixed;
    bottom: 85px;
    left: 70px;
  }
  @media (max-width: 996px) {
    left: 14%;
  }

  @media (max-width: 870px) {
    left: 13%;
  }

  @media (max-width: 850px) {
    left: 12%;
  }
`

export const DropdownItem = styled.div`
  display: fixed;
  align-items: center;
  padding: 12px 16px;
  font-size: 15px;
  color: ${colors.white};
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;

  &:hover {
    background-color: #1a1a1a;
  }

  &.bold {
    font-weight: 700;
  }
`
