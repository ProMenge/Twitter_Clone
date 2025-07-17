import styled from 'styled-components'
import { colors } from '../../styles'

export const PostDetailPageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.black};
  color: ${colors.white};
  font-family: 'Chirp', sans-serif;
  width: 100%;
  justify-content: center;

  &.blurred {
    filter: blur(5px);
    transition: filter 0.3s ease-in-out;
    pointer-events: none;
    user-select: none;
  }
`

export const PostDetailMainContent = styled.main`
  flex-grow: 1;
  max-width: 600px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-right: none;
  }
`

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background-color: ${colors.black};
  z-index: 10;
`

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${colors.white};
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #1a1a1a;
  }
`

export const Title = styled.h2`
  font-size: 19px;
  font-weight: 700;
  color: ${colors.white};
`

export const PostWrapper = styled.div`
  margin-bottom: 0px;
`

export const LoadingIndicator = styled.div`
  padding: 20px;
  text-align: center;
  color: ${colors.lightGray};
  font-size: 16px;
`

export const NoContentMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${colors.lightGray};
  font-size: 16px;
`

export const CommentSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 0;
`
