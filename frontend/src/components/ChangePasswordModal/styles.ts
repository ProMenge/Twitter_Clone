// src/components/ProfilePage/ChangePasswordModal/styles.ts
import styled from 'styled-components'
import { colors } from '../../styles'
import Button from '../Button/Button'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const ModalContent = styled.div`
  background: ${colors.black};
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 450px; /* Um pouco mais estreito, focado em senhas */
  color: ${colors.white};
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #2f3336;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.white};
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #1a1a1a;
  }
`

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${colors.white};
  text-align: center;
  flex-grow: 1;
`

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Input = styled.input`
  background: ${colors.black};
  border: 1px solid #536471;
  border-radius: 4px;
  color: ${colors.white};
  padding: 12px;
  width: 100%;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: ${colors.lightGray};
  }

  &:focus {
    border-color: #1d9bf0;
    box-shadow: 0 0 0 1px #1d9bf0;
  }
`

export const ErrorText = styled.p`
  color: #f4212e;
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 10px;
`

export const SaveButton = styled(Button)`
  /* Reutiliza o Button genérico */
  margin-top: 10px;
  width: 100%;
`
