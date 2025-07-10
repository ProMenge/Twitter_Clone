import * as S from './styles'
import React from 'react'

// Importar os ícones necessários do react-icons
import {
  FiMessageCircle,
  FiRepeat,
  FiHeart,
  FiShare,
  FiMoreHorizontal
} from 'react-icons/fi'
import { IoStatsChart } from 'react-icons/io5'

import { type PostType } from '../../types'
import { formatRelative, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PostProps {
  post: PostType
}

const Post: React.FC<PostProps> = ({ post }) => {
  const relativeDate = formatRelative(parseISO(post.created_at), new Date(), {
    locale: ptBR
  })
  return (
    <S.PostContainer>
      <S.AvatarWrapper
        style={{ backgroundImage: `url(${post.user.avatar_url})` }}
      />
      <S.PostContentWrapper>
        <S.PostHeader>
          <S.UserInfo>
            {/* Usar post.user.display_name e post.user.username */}
            <S.Username>{post.user.display_name}</S.Username>
            <S.Handle>@{post.user.username}</S.Handle>
            <S.Timestamp>{relativeDate}</S.Timestamp>{' '}
            {/* Usar created_at e formatar depois se precisar */}
          </S.UserInfo>
          <S.OptionsButton>
            <FiMoreHorizontal />
          </S.OptionsButton>
        </S.PostHeader>
        {/* Usar post.text_content */}
        <S.PostText>{post.text_content}</S.PostText>
        {/* Usar post.image */}
        {post.image && <S.PostImage src={post.image} alt="Post image" />}
        <S.PostActions>
          <S.ActionItem className="reply">
            <FiMessageCircle /> {post.comments_count > 0 && post.comments_count}
          </S.ActionItem>
          <S.ActionItem className="retweet">
            <FiRepeat /> {post.reposts_count > 0 && post.reposts_count}
          </S.ActionItem>
          <S.ActionItem className="like">
            <FiHeart /> {post.likes_count > 0 && post.likes_count}
          </S.ActionItem>
          <S.ActionItem className="views">
            <IoStatsChart /> {post.views_count}
          </S.ActionItem>
          <S.ActionItem className="share">
            <FiShare />
          </S.ActionItem>
        </S.PostActions>
      </S.PostContentWrapper>
    </S.PostContainer>
  )
}

export default Post
