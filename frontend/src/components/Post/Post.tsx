import React from 'react'
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
  post: PostType // Recebe o objeto post completo
  // NOVO: Adicionar uma prop para lidar com o toggle de curtida
  onLikeToggle: (postId: string | number, isCurrentlyLiked: boolean) => void
}

const Post: React.FC<PostProps> = ({ post, onLikeToggle }) => {
  const relativeDate = formatRelative(
    parseISO(post.created_at), // Converte a string ISO para um objeto Date
    new Date(), // Compara com a data/hora de agora
    { locale: ptBR } // Usa o idioma português
  )
  return (
    <S.PostContainer>
      <S.AvatarWrapper
        style={{ backgroundImage: `url(${post.user.avatar_url})` }}
      />
      <S.PostContentWrapper>
        <S.PostHeader>
          <S.UserInfo>
            <S.Username>{post.user.display_name}</S.Username>
            <S.Handle>@{post.user.username}</S.Handle>
            <S.Timestamp>{relativeDate}</S.Timestamp>
          </S.UserInfo>
          <S.OptionsButton>
            <FiMoreHorizontal />
          </S.OptionsButton>
        </S.PostHeader>
        <S.PostText>{post.text_content}</S.PostText>
        {post.image && <S.PostImage src={post.image} alt="Post image" />}
        <S.PostActions>
          <S.ActionItem className="reply">
            <FiMessageCircle /> {post.comments_count > 0 && post.comments_count}
          </S.ActionItem>
          <S.ActionItem className="retweet">
            <FiRepeat /> {post.reposts_count > 0 && post.reposts_count}
          </S.ActionItem>
          {/* NOVO: Botão de curtida com onClick */}
          <S.ActionItem
            className={`like ${post.is_liked_by_viewer ? 'liked' : ''}`} // Adicionar classe 'liked'
            onClick={() => onLikeToggle(post.id, !!post.is_liked_by_viewer)} // Passar id do post e se está curtido
          >
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
