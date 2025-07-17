import styled from 'styled-components'
import { colors } from '../../styles'
export const PostContainer = styled.div`
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #2f3336;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #080808;
  }
`

export const AvatarWrapper = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: gray;
  margin-right: 12px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
`

export const PostContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
`

export const Username = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: ${colors.white};
  margin-right: 4px;

  &:hover {
    text-decoration: underline;
  }
`

export const Handle = styled.span`
  color: ${colors.lightGray};
  font-size: 15px;
  margin-right: 4px;
`

export const Timestamp = styled.span`
  color: ${colors.lightGray};
  font-size: 15px;
  white-space: nowrap;

  &::before {
    content: '•';
    margin: 0 4px;
  }
`

export const PostText = styled.p`
  font-size: 15px;
  color: ${colors.white};
  line-height: 20px;
  margin-bottom: 12px;
  word-wrap: break-word;
`

export const PostImage = styled.img`
  max-width: 100%;
  border-radius: 16px;
  margin-top: 12px;
  margin-bottom: 12px;
  height: auto;
  display: block;
`

export const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: ${colors.lightGray};
  width: 100%;
  max-width: 425px;

  @media (max-width: 768px) {
    max-width: none;
  }
`

export const ActionItem = styled.div`
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

  &.reply:hover {
    color: #1d9bf0;
    svg {
      color: #1d9bf0;
    }
  }
  &.retweet:hover {
    color: #00ba7c;
    svg {
      color: #00ba7c;
    }
  }
  &.like:hover {
    color: #f91880;
    svg {
      color: #f91880;
    }
  }
  &.like.liked {
    color: #f91880;
    svg {
      color: #f91880;
      fill: #f91880;
    }
  }
  &.views:hover {
    color: #1d9bf0;
    svg {
      color: #1d9bf0;
    }
  }
  &.share:hover {
    color: #1d9bf0;
    svg {
      color: #1d9bf0;
    }
  }
`

export const OptionsButton = styled.button`
  background: none;
  border: none;
  color: ${colors.lightGray};
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
  margin-left: auto;

  &:hover {
    background-color: #1a1a1a;
    color: ${colors.white};
  }
`
