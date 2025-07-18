import React from 'react'
import { useNavigate } from 'react-router-dom'
import * as S from './styles'

import { formatRelative, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiRepeat,
  FiShare
} from 'react-icons/fi'
import { IoStatsChart } from 'react-icons/io5'
import type { PostType } from '../../types'

interface PostProps {
  post: PostType
  onLikeToggle: (postId: string | number, isCurrentlyLiked: boolean) => void
}

const Post: React.FC<PostProps> = ({ post, onLikeToggle }) => {
  const navigate = useNavigate()

  const handleGoToProfile = () => {
    navigate(`/profile/${post.user.username}`)
  }

  const handleGoToPost = () => {
    navigate(`/post/${post.id}`)
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onLikeToggle(post.id, !!post.is_liked_by_viewer)
  }

  const relativeDate = formatRelative(parseISO(post.created_at), new Date(), {
    locale: ptBR
  })

  return (
    <S.PostContainer onClick={handleGoToPost}>
      <S.AvatarWrapper
        style={{ backgroundImage: `url(${post.user.avatar_url})` }}
        onClick={(e) => {
          e.stopPropagation()
          handleGoToProfile()
        }}
      />
      <S.PostContentWrapper>
        <S.PostHeader>
          <S.UserInfo
            onClick={(e) => {
              e.stopPropagation()
              handleGoToProfile()
            }}
            role="button"
          >
            <S.Username>{post.user.display_name}</S.Username>
            <S.Handle>@{post.user.username}</S.Handle>
            <S.Timestamp>{relativeDate}</S.Timestamp>
          </S.UserInfo>
          <S.OptionsButton onClick={(e) => e.stopPropagation()}>
            <FiMoreHorizontal />
          </S.OptionsButton>
        </S.PostHeader>

        <S.PostText>{post.text_content}</S.PostText>
        {post.image && <S.PostImage src={post.image} alt="Post image" />}

        <S.PostActions>
          <S.ActionItem
            className="reply"
            onClick={(e) => {
              e.stopPropagation()
              handleGoToPost()
            }}
          >
            <FiMessageCircle /> {post.comments_count > 0 && post.comments_count}
          </S.ActionItem>

          <S.ActionItem
            className="retweet"
            onClick={(e) => e.stopPropagation()}
          >
            <FiRepeat /> {post.reposts_count > 0 && post.reposts_count}
          </S.ActionItem>

          <S.ActionItem
            className={`like ${post.is_liked_by_viewer ? 'liked' : ''}`}
            onClick={handleLikeClick}
          >
            <FiHeart /> {post.likes_count > 0 && post.likes_count}
          </S.ActionItem>

          <S.ActionItem className="views" onClick={(e) => e.stopPropagation()}>
            <IoStatsChart /> {post.views_count}
          </S.ActionItem>

          <S.ActionItem className="share" onClick={(e) => e.stopPropagation()}>
            <FiShare />
          </S.ActionItem>
        </S.PostActions>
      </S.PostContentWrapper>
    </S.PostContainer>
  )
}

export default Post
