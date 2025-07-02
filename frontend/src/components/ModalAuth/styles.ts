import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Modal = styled.div`
  background: black;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-weight: 700;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  font-weight: 300;
  position: absolute;
  top: 15px;
  left: 15px;
  cursor: pointer;
`

export const Logo = styled.img`
  width: 30px;
  align-self: center;
`

export const Title = styled.h2`
  font-size: 31px;
  font-weight: bold;
  text-align: left;
`

export const Input = styled.input`
  background: transparent;
  border: 1px solid #536471;
  border-radius: 4px;
  color: white;
  padding: 12px;
  width: 100%;
  margin-bottom: 10px;
`

export const Label = styled.label`
  font-size: 14px;
  margin: 10px 0 5px;
`

export const BirthContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`

export const Select = styled.select`
  flex: 1;
  padding: 12px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid #536471;
  color: white;
  option {
    background-color: black; // Fundo preto para as opções
    color: white; // Texto branco para as opções
  }
`

export const AdvanceButton = styled.button`
  background: #1d9bf0;
  border: none;
  border-radius: 25px;
  color: white;
  padding: 12px;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

export const ForgotPassword = styled.a`
  color: #1d9bf0;
  text-align: center;
  margin-top: 15px;
  display: block;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const Error = styled.p`
  color: #f4212e;
  font-size: 12px;
  margin: 5px 0;
`
