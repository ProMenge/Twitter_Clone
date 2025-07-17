import styled from 'styled-components'
import { colors } from '../../styles'
import Button from '../Button/Button'

export const CommentSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const CommentFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 4px 12px;
  border-bottom: 1px solid #2f3336;
`

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
  background-color: gray;
  background-size: cover;
  background-position: center;
`

export const TextArea = styled.textarea`
  flex-grow: 1;
  border: none;
  background: none;
  color: ${colors.white};
  font-size: 19px;
  line-height: 24px;
  resize: none;
  padding: 8px 0;
  min-height: 50px;
  outline: none;

  &::placeholder {
    color: ${colors.lightGray};
  }
`

export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
`

export const IconsContainer = styled.div`
  display: flex;
  gap: 15px;

  button {
    background: none;
    border: none;
    color: #1d9bf0;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: rgba(29, 155, 240, 0.1);
    }
  }
`

export const CommentListItem = styled.div`
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #2f3336;
  cursor: pointer;

  &:hover {
    background-color: #080808;
  }

  .comment-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: gray;
    background-size: cover;
    background-position: center;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .comment-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  .display-name {
    font-weight: 700;
    font-size: 15px;
    color: ${colors.white};
    margin-right: 4px;
  }

  .username {
    color: ${colors.lightGray};
    font-size: 15px;
    margin-right: 4px;
  }

  .timestamp {
    color: ${colors.lightGray};
    font-size: 15px;
    white-space: nowrap;

    &::before {
      content: '•';
      margin: 0 4px;
    }
  }

  .comment-text {
    font-size: 15px;
    color: ${colors.white};
    line-height: 20px;
    margin-bottom: 12px;
  }
`

export const CommentActions = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${colors.lightGray};
  width: 100%;
  max-width: 425px;
  margin-top: 5px;

  div {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: color 0.2s ease-in-out;

    svg {
      font-size: 18px;
      transition: color 0.2s ease-in-out;
    }

    &:hover {
      color: #1d9bf0;
      svg {
        color: #1d9bf0;
      }
    }
    /* NOVO: Estilo para o estado 'liked' */
    &.liked {
      /* Use esta classe para o botão curtido */
      color: #f91880; /* Cor rosa quando já está curtido */
      svg {
        color: #f91880;
        fill: #f91880; /* Preenche o coração quando curtido */
      }
    }
  }
`

export const NoContentMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${colors.lightGray};
  font-size: 16px;
`

export const LoadingIndicator = styled.div`
  padding: 20px;
  text-align: center;
  color: ${colors.lightGray};
  font-size: 16px;
`

export const TextAreaWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const ReplyButton = styled(Button)`
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 700;
  border-radius: 9999px;
  background-color: ${colors.white};
  color: black;

  &:disabled {
    opacity: 0.6;
    cursor: default;

    background-color: ${colors.white};
    color: black;
  }
`
