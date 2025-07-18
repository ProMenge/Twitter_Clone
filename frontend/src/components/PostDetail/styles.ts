import styled from 'styled-components'
import { colors } from '../../styles'

export const Container = styled.div`
  padding: 16px;
  padding-bottom: 0px;
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
`

export const Avatar = styled.img`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: gray;
  margin-right: 12px;
  background-size: cover;
  background-position: center;
  object-fit: cover;
  cursor: pointer;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  cursor: pointer;
`

export const DisplayName = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: ${colors.white};

  &:hover {
    text-decoration: underline;
  }
`

export const Username = styled.span`
  font-size: 14px;
  color: ${colors.lightGray};
`

export const MoreButton = styled.button`
  background: none;
  border: none;
  color: ${colors.lightGray};
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;

  &:hover {
    color: ${colors.white};
  }
`

export const Content = styled.p`
  font-size: 16px;
  color: ${colors.white};
  margin: 16px 0;
  word-wrap: break-word;
`

export const Image = styled.img`
  max-width: 100%;
  border-radius: 16px;
  margin-bottom: 12px;
`

export const Meta = styled.div`
  color: ${colors.lightGray};
  font-size: 15px;
  margin-bottom: 16px;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #2f3336;
  margin: 16px 0;
`

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  color: ${colors.lightGray};
`

export const Action = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  cursor: pointer;

  svg {
    font-size: 18px;
  }

  &.reply:hover {
    color: #1d9bf0;
  }
  &.retweet:hover {
    color: #00ba7c;
  }
  &.like:hover,
  &.like.liked {
    color: #f91880;
    svg {
      color: #f91880;
      fill: #f91880;
    }
  }
  &.views:hover {
    color: #1d9bf0;
  }
  &.share:hover {
    color: #1d9bf0;
  }
`
