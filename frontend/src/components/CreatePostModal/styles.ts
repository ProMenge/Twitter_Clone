import styled from 'styled-components'
import { colors } from '../../styles'

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Fundo escuro semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Garante que o overlay fique acima de outros elementos */
`

export const ModalContent = styled.div`
  background-color: ${colors.black}; /* Fundo do modal */
  border-radius: 16px; /* Bordas arredondadas */
  width: 90%;
  max-width: 600px; /* Largura máxima similar ao X */
  max-height: 90vh; /* Altura máxima para evitar que o modal seja maior que a tela */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Garante que nada vaze das bordas arredondadas */
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #2f3336; /* Linha divisória */
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.white};
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #1a1a1a;
  }
`

export const DraftsButton = styled.button`
  background: none;
  border: none;
  color: ${colors.lightBlue}; /* Cor azul para o botão "Rascunhos" */
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 9999px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(29, 155, 240, 0.1); /* Azul claro no hover */
  }
`

export const ModalBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Permite que o body ocupe o espaço restante */
  overflow-y: auto; /* Permite rolagem se o conteúdo for muito grande */

  /* Estilos da scrollbar para o corpo do modal, se necessário */
  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #2f3336;
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #383b3f;
  }
  scrollbar-width: thin;
  scrollbar-color: #2f3336 transparent;
`

export const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: gray; /* Placeholder */
  margin-right: 12px;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
`

export const AudienceSelector = styled.div`
  display: flex;
  align-items: center;
  background-color: transparent; /* Fundo para o seletor */
  border: 1px solid ${colors.gray};
  color: ${colors.lightBlue};
  font-size: 14px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #222222;
  }

  svg {
    margin-left: 5px;
    font-size: 16px;
  }
`

export const PostTextArea = styled.textarea`
  width: 100%;
  border: none;
  background: none;
  color: ${colors.white};
  font-size: 20px;
  line-height: 24px;
  resize: none; /* Impede redimensionamento manual */
  min-height: 100px; /* Altura mínima */
  padding: 10px 0; /* Padding interno */
  outline: none; /* Remove a borda de foco padrão */

  &::placeholder {
    color: ${colors.lightGray};
  }
`

export const ImagePreviewContainer = styled.div`
  position: relative;
  margin-top: 15px;
  margin-bottom: 15px;
  max-width: 100%;
  border-radius: 16px;
  overflow: hidden; /* Garante que a imagem não vaze */
`

export const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 16px;
`

export const RemoveImageButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: ${colors.white};
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`

export const ReplyAudience = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.lightBlue};
  font-size: 14px;
  margin-top: 15px;
  padding-top: 15px;

  cursor: pointer;

  svg {
    margin-right: 5px;
    font-size: 16px;
  }

  &:hover {
    text-decoration: underline;
  }
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #2f3336; /* Linha divisória */
`

export const ActionIcons = styled.div`
  display: flex;
  gap: 10px; /* Espaço entre os ícones */

  button {
    background: none;
    border: none;
    color: ${colors.lightBlue}; /* Cor azul para os ícones de ação */
    font-size: 17px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: rgba(29, 155, 240, 0.1);
    }
  }
`

export const PostButton = styled.button<{ $disabled: boolean }>`
  background-color: ${({ $disabled }) =>
    $disabled
      ? '#164D7A'
      : '#1D9BF0'}; /* Azul mais escuro quando desabilitado */
  color: ${colors.white};
  border: none;
  border-radius: 9999px;
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 700;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition:
    opacity 0.2s ease-in-out,
    background-color 0.2s ease-in-out;

  &:hover {
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 0.9)};
  }
`
