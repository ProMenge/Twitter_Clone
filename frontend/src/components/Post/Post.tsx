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
import { IoStatsChart } from 'react-icons/io5' // Ícone de visualizações

// Definindo a interface para as props do componente Post
interface PostProps {
  id: string
  avatarUrl: string
  username: string
  handle: string
  text: string
  timestamp: string
  comments: number
  retweets: number
  likes: number
  views: string // Mantido como string porque pode ser "23 mil"
  imageUrl?: string // Opcional, se o post tiver uma imagem
}

const Post: React.FC<PostProps> = ({
  avatarUrl,
  username,
  handle,
  text,
  timestamp,
  comments,
  retweets,
  likes,
  views,
  imageUrl
}) => {
  return (
    <S.PostContainer>
      <S.AvatarWrapper style={{ backgroundImage: `url(${avatarUrl})` }} />
      <S.PostContentWrapper>
        <S.PostHeader>
          <S.UserInfo>
            <S.Username>{username}</S.Username>
            <S.Handle>{handle}</S.Handle>
            <S.Timestamp>{timestamp}</S.Timestamp>
          </S.UserInfo>
          <S.OptionsButton>
            <FiMoreHorizontal />
          </S.OptionsButton>{' '}
          {/* Botão de opções (reticências) */}
        </S.PostHeader>
        <S.PostText>{text}</S.PostText>
        {imageUrl && <S.PostImage src={imageUrl} alt="Post image" />}
        <S.PostActions>
          <S.ActionItem className="reply">
            <FiMessageCircle /> {comments > 0 && comments}
          </S.ActionItem>
          <S.ActionItem className="retweet">
            <FiRepeat /> {retweets > 0 && retweets}
          </S.ActionItem>
          <S.ActionItem className="like">
            <FiHeart /> {likes > 0 && likes}
          </S.ActionItem>
          <S.ActionItem className="views">
            <IoStatsChart /> {views}
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
