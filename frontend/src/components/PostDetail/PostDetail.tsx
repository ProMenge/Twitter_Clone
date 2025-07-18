import { format } from 'date-fns'
import {
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiRepeat,
  FiShare
} from 'react-icons/fi'
import { IoStatsChart } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import type { PostType } from '../../types'
import * as S from './styles'

interface PostDetailProps {
  post: PostType
  onLikeToggle: (postId: string | number, isCurrentlyLiked: boolean) => void
}

export default function PostDetail({ post, onLikeToggle }: PostDetailProps) {
  const navigate = useNavigate()

  const formattedDate = format(
    new Date(post.created_at),
    "hh:mm a '·' MMM dd, yyyy"
  )

  const handleGoToProfile = () => {
    navigate(`/profile/${post.user.username}`)
  }

  return (
    <S.Container>
      <S.Header>
        <S.Avatar src={post.user.avatar_url} onClick={handleGoToProfile} />
        <S.UserInfo onClick={handleGoToProfile} role="button">
          <S.DisplayName>{post.user.display_name}</S.DisplayName>
          <S.Username>@{post.user.username}</S.Username>
        </S.UserInfo>
        <S.MoreButton>
          <FiMoreHorizontal />
        </S.MoreButton>
      </S.Header>

      <S.Content>{post.text_content}</S.Content>
      {post.image && <S.Image src={post.image} alt="Post image" />}

      <S.Meta>
        {formattedDate} · <strong>{post.views_count} Views</strong>
      </S.Meta>

      <S.Divider />

      <S.Actions>
        <S.Action className="reply">
          <FiMessageCircle />
          {post.comments_count}
        </S.Action>
        <S.Action className="retweet">
          <FiRepeat />
          {post.reposts_count}
        </S.Action>
        <S.Action
          className={`like ${post.is_liked_by_viewer ? 'liked' : ''}`}
          onClick={() => onLikeToggle(post.id, !!post.is_liked_by_viewer)}
        >
          <FiHeart />
          {post.likes_count}
        </S.Action>
        <S.Action className="views">
          <IoStatsChart />
        </S.Action>
        <S.Action className="share">
          <FiShare />
        </S.Action>
      </S.Actions>

      <S.Divider />
    </S.Container>
  )
}
