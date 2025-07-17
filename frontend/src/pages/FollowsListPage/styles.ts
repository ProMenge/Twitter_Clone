// src/pages/FollowsListPage/styles.ts
import styled from 'styled-components'
import { colors } from '../../styles'
import Button from '../../components/Button/Button'

export const FollowsPageContainer = styled.div`
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

export const FollowsMainContent = styled.main`
  flex-grow: 1;
  max-width: 600px;
  border-left: 1px solid #2f3336;
  border-right: 1px solid #2f3336;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-right: none;
  }
`

export const FollowsHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 16px;
  position: sticky;
  top: 0;
  background-color: ${colors.black};
  z-index: 10;
`

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
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

export const UserInfoTitle = styled.div`
  display: flex;
  flex-direction: column;

  .display-name {
    font-weight: 700;
    font-size: 19px;
    color: ${colors.white};
  }

  .handle {
    font-size: 13px;
    color: ${colors.lightGray};
  }
`

export const FollowsTabs = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #2f3336;
`

export const FollowTab = styled.div`
  flex: 1;
  padding: 15px 0;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  color: ${colors.lightGray};
  transition: background-color 0.2s ease-in-out;
  position: relative;

  &:hover {
    background-color: #080808;
  }

  &.active {
    color: ${colors.white};
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 4px;
      background-color: #1d9bf0;
      border-radius: 2px;
    }
  }
`

export const UserListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;

  &:hover {
    background-color: #080808;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-grow: 1;
    min-width: 0;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: gray;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
  }

  .text-details {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;
  }

  .display-name {
    font-weight: 700;
    font-size: 15px;
    color: ${colors.white};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .username {
    color: ${colors.lightGray};
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const FollowButton = styled(Button)`
  flex-shrink: 0;
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
