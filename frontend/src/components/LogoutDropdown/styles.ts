import styled from 'styled-components'
import { colors } from '../../styles'

export const DropdownContainer = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  background-color: ${colors.black};
  border-radius: 16px;
  box-shadow:
    rgba(255, 255, 255, 0.2) 0px 0px 15px,
    rgba(255, 255, 255, 0.15) 0px 0px 3px 1px;
  width: 220px;
  overflow: hidden;
  z-index: 100;
  padding: 10px 0;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${colors.black};
  }

  @media (max-width: 1024px) {
    left: 50%;
    transform: translateX(-50%);
    width: 250px;
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

export const DropdownItem = styled.div`
  display: flex;
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

  &.text-danger {
    color: #f4212e;
  }
`
