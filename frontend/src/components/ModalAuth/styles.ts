import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(29, 155, 240, 0.15);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Modal = styled.div`
  background: black;
  border-radius: 16px;
  padding: 20px 66px 30px;
  width: 90%;
  max-width: 560px;
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-weight: 700;

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 20px 20px;
  }
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

  &:hover {
    background-color: #1a1a1a;
    border-radius: 50%;
  }
`

export const Logo = styled.img`
  width: 32px;
  align-self: center;
  margin-bottom: 10px;
`

export const Title = styled.h2`
  font-size: 31px;
  font-weight: 700;
  text-align: left;
  margin-bottom: 25px;
`

export const Input = styled.input`
  background: black;
  border: 1px solid #536471;
  border-radius: 4px;
  color: white;
  padding: 18px 12px 10px;
  width: 100%;
  /* Removido margin-bottom: 25px; daqui. Será gerenciado pelo ContactInputGroup ou pelo Modal */
  font-size: 17px;
  margin-bottom: 20px;

  &::placeholder {
    color: #71767b;
    font-size: 17px;
  }

  &:focus {
    outline: none;
    border-color: #1d9bf0;
    box-shadow: 0 0 0 1px #1d9bf0;
  }
`

// Novo styled component para agrupar o input de contato e o botão de alternar
export const ContactInputGroup = styled.div`
  display: flex;
  flex-direction: column; /* Para empilhar o input e o botão */
  position: relative; /* Para posicionamento absoluto do ToggleButton se necessário, embora flex seja melhor */
  margin-bottom: 25px; /* Espaço após este grupo, antes de "Data de nascimento" */
`

export const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: #1d9bf0;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  text-align: right; /* Alinha o texto à direita */
  align-self: flex-end; /* Alinha o botão à direita dentro do ContactInputGroup */
  margin-top: 5px; /* Pequeno espaço entre o input e o botão */
  padding: 0; /* Remover padding padrão do botão */

  &:hover {
    text-decoration: underline;
  }
`

export const Label = styled.label`
  font-size: 14px;
  margin: 10px 0 5px;
  color: white;
  font-weight: bold;
`

export const InfoText = styled.p`
  font-size: 14px;
  font-weight: 400;
  margin: 10px 0 5px;
  color: #71767b;
  font-family: 'Chirp', sans-serif;
  font-weight: 400;
  margin-bottom: 15px;
`

export const BirthContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
`

export const Select = styled.select`
  flex: 1;
  padding: 12px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid #536471;
  color: #71767b;
  font-size: 17px;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  option {
    background-color: black;
    color: white;
  }
`

export const AdvanceButton = styled.button`
  background: #ebeef0;
  border: none;
  border-radius: 25px;
  color: #000;
  padding: 15px;
  width: 100%;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease-in-out,
    color 0.2s ease-in-out;
  margin-top: 15px;

  &[type='submit']:enabled {
    background: #1d9bf0;
    color: white;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
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
